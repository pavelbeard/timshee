import "./Account.css";
import React, {useEffect} from "react";
import {Link, redirect, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getEmail} from "./api";
import {getLastOrder, getAddressAsTrue} from "./forms/reducers/asyncThunks";
import AuthService from "../api/authService";
import Loading from "../Loading";

const API_URL = process.env.REACT_APP_API_URL;

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const {order, lastOrderStatus} = useSelector(state => state.ordersPage);
    const {addressObject, addressAsTrueStatus} = useSelector(state => state.addressForm);
    const [email, setEmail] = React.useState("");

    const [shipTo, setShipTo] = React.useState("");
    const [for_, setFor] = React.useState("");
    const [deliveredAt, setDeliveredAt] = React.useState("");

    useEffect(() => {
        if (user?.access && addressAsTrueStatus === 'idle') {
            console.log("WORKING")
            dispatch(getAddressAsTrue({token: user}));
        }

        if (user?.access && lastOrderStatus === 'idle') {
            dispatch(getLastOrder({token: user}));
        }
    }, [addressAsTrueStatus, lastOrderStatus, order, addressObject]);

    useEffect(() => {
        if (order !== undefined) {
            setShipTo(
                [
                    `${order.shipping_address?.province?.country?.name}, `,
                    `${order.shipping_address.postal_code}, `,
                    `${order.shipping_address?.province?.name}, `,
                    `${order.shipping_address.city}, `,
                    `${order.shipping_address.address1}, `,
                    `${order.shipping_address.address2} `
                ].join("")
            );
            setFor(order.shipping_address.firstName + " " + order.shipping_address.last_name);

            if (order.status === "completed") {
                setDeliveredAt(order.updated_at)
            }
        }
    }, [order]);

    useEffect(() => {
        const fetchEmail = async () => {
            if (user?.access) {
                const emailInternal = await getEmail({token: user});
                setEmail(emailInternal);
            }
        };

        fetchEmail();
    }, [email]);

    if (!user?.access) {
        return (
            <div className="account common">
                Forbidden...
            </div>
        )
    }

    if (addressAsTrueStatus === 'success' && lastOrderStatus === 'success')
    {
        return (
            <div className="account common account-authorized">
                <div className="first-block">
                    <span>Account:</span>
                    <span className="user-name">{email}</span>
                    <form onSubmit={() => {
                        AuthService.logout();
                        redirect("/");
                    }}>
                        <button type="submit">Logout</button>
                    </form>
                </div>
                <div className="second-block">
                    <div className="blocks-container">
                        <div className="block-1">
                            <div className="block-title">PRIMARY ADDRESS</div>
                            <div className="divider"></div>
                            <div className="info-block info-block-main">
                                {
                                    addressObject.firstName === "" || addressObject.firstName === undefined ? (
                                        <div>THERE AREN'T ANY PRIMARY ADDRESS</div>
                                    ) : (
                                        <>
                                            <div>{addressObject.firstName} {addressObject.lastName}</div>
                                            <div>{addressObject.streetAddress}</div>
                                            <div>{addressObject.apartment}</div>
                                            <div>{addressObject.postalCode}</div>
                                            <div>{addressObject.city}</div>
                                            <div>{addressObject.province?.name}</div>
                                            <div>{addressObject.province?.country.name}</div>
                                            <div>±{addressObject.phoneCode?.phone_code} {addressObject.phoneNumber}</div>
                                            <div>{addressObject.email}</div>

                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <Link className="go-to-list" to="/account/details/addresses">
                            Edit addresses
                        </Link>
                    </div>
                    <div className="blocks-container">
                        <div className="block-2">
                            <div className="block-title">Orders</div>
                            <div className="divider"></div>
                            <div className="info-block info-block-main">
                                {
                                    order.id === 0 ? (
                                        <div>THERE AREN'T ANY ORDERS</div>
                                    ) : (
                                        <>
                                            <div>{order.order_number}</div>
                                            {
                                                order.status === "completed" ? (
                                                    <div>
                                                        <span>DELIVERED AT:</span>
                                                        <span>{new Date(deliveredAt).toDateString()}</span>
                                                    </div>
                                                ) : order.status === "refunded" || order.status === "partial_refunded" ? (
                                                    <>
                                                        <div>
                                                            <span>STATUS:</span>
                                                            <span>{order.status}</span>
                                                        </div>
                                                        <div>
                                                            <span>REFUNDED AT:</span>
                                                            <span>{new Date(order.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <span>STATUS:</span>
                                                            <span>{order.status}</span>
                                                        </div>
                                                        <div>
                                                            <span>CREATED AT:</span>
                                                            <span>{new Date(order.created_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className="order-img-block order-img-block-principal">
                                            {order.order_item.map((item, index) => (
                                                <img style={{
                                                    marginRight: "10px",
                                                    filter: order.status === ("refunded" || "partial_refunded")
                                                        ? "brightness(0.6)" : "none",
                                                }}
                                                     src={`${API_URL}${item.item.item.image}`} height={90}
                                                     key={index} alt={`alt-img-${index}`}/>
                                            ))}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <Link className="go-to-list" to="/account/details/orders">
                            See orders
                        </Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return <Loading />;
    }


};

export default Account;