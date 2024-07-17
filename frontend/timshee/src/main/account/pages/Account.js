import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getEmail} from "../api";
import {getLastOrder, getAddresses} from "./forms/reducers/asyncThunks";
import AuthService from "../../api/authService";
import Loading from "../../techPages/Loading";
import t from "../../translate/TranslateService";
import {toggleChangeEmail} from "../../../redux/slices/menuSlice";
import {toCamelCase} from "../../api/stuff";
import "./Account.css";

import { API_URL } from '../../../config';

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = t.language();
    const user = AuthService.getCurrentUser();
    const {order, lastOrderStatus} = useSelector(state => state.ordersPage);
    const {changedEmail} = useSelector(state => state.account);
    const {addressObject, addresses, shippingAddressesStatus: addressesStatus} = useSelector(state => state.addressForm);
    const [email, setEmail] = React.useState("");

    const [shipTo, setShipTo] = React.useState("");
    const [for_, setFor] = React.useState("");
    const [deliveredAt, setDeliveredAt] = React.useState("");

    useEffect(() => {
        if (user?.access && addressesStatus === 'idle') {
            dispatch(getAddresses({token: user}))
        }

        if (user?.access && lastOrderStatus === 'idle') {
            dispatch(getLastOrder({token: user}));
        }
    }, [addressesStatus, lastOrderStatus, order, addressObject]);

    useEffect(() => {
        if (order !== undefined && order.shipping_address !== undefined) {
            setShipTo(
                [
                    `${order.shipping_address?.province?.country?.name}, `,
                    `${order.shipping_address?.postal_code}, `,
                    `${order.shipping_address?.province?.name}, `,
                    `${order.shipping_address?.city}, `,
                    `${order.shipping_address?.address1}, `,
                    `${order.shipping_address?.address2} `
                ].join("")
            );
            setFor(order.shipping_address?.firstName + " " + order.shipping_address?.last_name);

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
    }, [email, changedEmail]);

    if (!user?.access) {
        return (
            <div className="account common">
                Forbidden...
            </div>
        )
    }

    if (addressesStatus === 'success' && lastOrderStatus === 'success')
    {
        const primaryAddress = addresses.find(a => a.as_primary);
        const lastOrder = null;
        return (
            <div className="account common account-authorized">
                <div className="first-block">
                    <span>Account:</span>
                    <span className="user-name" onClick={() => dispatch(toggleChangeEmail())}>{email}</span>
                    <form onSubmit={() => {
                        AuthService.logout();
                        navigate("/");
                    }}>
                        <button type="submit">
                            {t.account.logout[language]}
                        </button>
                    </form>
                </div>
                <div className="second-block">
                    <div className="blocks-container">
                        <div className="block-1">
                            <div className="block-title">{t.account.primaryAddress[language]}</div>
                            <div className="divider"></div>
                            <div className="info-block info-block-main">
                                {
                                    primaryAddress ? (
                                        <>
                                            <div>{primaryAddress?.first_name} {primaryAddress?.last_name}</div>
                                            <div>{primaryAddress?.address1}</div>
                                            <div>{primaryAddress?.address2}</div>
                                            <div>{primaryAddress?.postal_code}</div>
                                            <div>{primaryAddress?.city}</div>
                                            <div>{primaryAddress?.province?.name}</div>
                                            <div>{primaryAddress?.province?.country.name}</div>
                                            <div>±{primaryAddress?.phone_code?.phone_code} {primaryAddress?.phone_number}</div>
                                            <div>{primaryAddress?.email}</div>

                                        </>
                                    ) : (
                                        <div>{t.account.noAddress[language]}</div>
                                    )
                                }
                            </div>
                        </div>
                        <Link className="go-to-list" to={`/account/details/addresses`}>
                            {t.account.editAddress[language]}
                        </Link>
                    </div>
                    <div className="blocks-container">
                        <div className="block-2">
                            <div className="block-title">{t.account.orders[language]}</div>
                            <div className="divider"></div>
                            <div className="info-block info-block-main">
                                {
                                    order.id === undefined
                                    // order.id === 0 &&
                                    // order.status === "created"
                                    ? (
                                        <div>{t.account.noOrders[language]}</div>
                                    ) : (
                                        <>
                                            <div>{order.order_number}</div>
                                            {
                                                order.status === "completed" ? (
                                                    <div>
                                                        <span>{t.account.deliveredAt[language]}</span>
                                                        <span>{new Date(deliveredAt).toDateString()}</span>
                                                    </div>
                                                ) : (order.status === "refunded" || order.status === "partial_refunded") ? (
                                                    <>
                                                        <div>
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(order.status)][language]}</span>
                                                        </div>
                                                        <div>
                                                            <span>{t.account.refundedAt[language]}</span>
                                                            <span>{new Date(order.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(order.status)][language]}</span>
                                                        </div>
                                                        <div>
                                                            <span>{t.account.updatedAt[language]}</span>
                                                            <span>{new Date(order.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className="order-img-block order-img-block-principal">
                                            {Array.isArray(order?.order_item) && order.order_item.map((item, index) => (
                                                <img style={{
                                                    marginRight: "10px",
                                                    filter: order.status === "refunded" ||
                                                            order.status === "partial_refunded"
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
                        <Link className="go-to-list" to={`/account/details/orders`}>
                            {t.account.seeOrders[language]}
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