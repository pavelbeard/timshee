import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getLastOrder} from "./forms/reducers/asyncThunks";
import t from "../../translate/TranslateService";
import {toggleChangeEmail} from "../../../redux/slices/menuSlice";
import {toCamelCase} from "../../api/stuff";
import "./Account.css";

import { API_URL } from '../../../config';
import {
    selectCurrentToken,
    selectCurrentUser,
    setCredentials,
    signOut
} from "../../../redux/services/features/auth/authSlice";
import {useGetCurrentUserMutation} from "../../../redux/services/features/auth/getUserApiSlice";
import {
    useGetAddressesByUserMutation,
    useGetOrdersByUserMutation
} from "../../../redux/services/features/account/accountDataApiSlice";
import {setAddresses, setOrders} from "../../../redux/services/features/account/accountDataSlice";

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = t.language();
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);
    const [getCurrentUser, { isLoading: isUserLoading }] = useGetCurrentUserMutation();
    const [getAddressesByUser, { isLoading: isAddressesLoading }] = useGetAddressesByUserMutation();
    const [getOrdersByUser, { isLoading: isOrdersLoading }] = useGetOrdersByUserMutation();
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [lastOrder, setLastOrder] = useState(null);

    const [shipTo, setShipTo] = React.useState("");
    const [for_, setFor] = React.useState("");
    const [deliveredAt, setDeliveredAt] = React.useState("");

    useEffect(() => {
        const fetchAll = async () => {
              const [user, addresses, orders] = await Promise.allSettled([
                  getCurrentUser().unwrap(),
                  getAddressesByUser().unwrap(),
                  getOrdersByUser().unwrap(),
              ]);

              if (user?.status === 'fulfilled') dispatch(setCredentials({ token, user: user.value.email }));
              if (addresses?.status === 'fulfilled') {
                  dispatch(setAddresses(addresses.value));
                  setPrimaryAddress(addresses.value.find(a => a.as_primary));
              }
              if(orders?.status === 'fulfilled') {
                  dispatch(setOrders(orders.value));
                  const _lastOrder = orders.value?.at(-1)
                  setLastOrder(_lastOrder);

                  if (_lastOrder && _lastOrder?.shipping_address) {
                      setShipTo(
                        [
                            `${lastOrder?.shipping_address?.province?.country?.name}, `,
                            `${lastOrder?.shipping_address?.postal_code}, `,
                            `${lastOrder?.shipping_address?.province?.name}, `,
                            `${lastOrder?.shipping_address?.city}, `,
                            `${lastOrder?.shipping_address?.address1}, `,
                            `${lastOrder?.shipping_address?.address2} `
                        ].join("")
                      );
                      setFor(_lastOrder?.shipping_address?.firstName + " " + lastOrder?.shipping_address?.last_name);

                      if (lastOrder?.status === "completed") {
                          setDeliveredAt(_lastOrder?.updated_at)
                      }
                  }
              }
        };

        fetchAll();
    }, [dispatch]);

    return (
        <div className="account common account-authorized">
            <div className="first-block">
                <span>Account:</span>
                <span className="user-name" onClick={() => dispatch(toggleChangeEmail())}>{user}</span>
                <form onSubmit={() => {
                    dispatch(signOut());
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
                            {primaryAddress
                                    ?
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
                                    :
                                    <div>{t.account.noAddress[language]}</div>
                            }
                        </div>
                    </div>
                    <Link className="go-to-list" to={`/account/details/addresses`}>
                        Просмотреть адреса
                    </Link>
                </div>
                <div className="blocks-container">
                    <div className="block-2">
                        <div className="block-title">{t.account.orders[language]}</div>
                        <div className="divider"></div>
                        <div className="info-block info-block-main">
                            {
                                lastOrder?.id === undefined
                                    // order.id === 0 &&
                                    // order.status === "created"
                                    ? (
                                        <div>{t.account.noOrders[language]}</div>
                                    ) : (
                                        <>
                                            <div>{lastOrder.order_number}</div>
                                            {
                                                lastOrder.status === "completed" ? (
                                                    <div>
                                                        <span>{t.account.deliveredAt[language]}</span>
                                                        <span>{new Date(deliveredAt).toDateString()}</span>
                                                    </div>
                                                ) : (lastOrder.status === "refunded" || lastOrder.status === "partial_refunded") ? (
                                                    <>
                                                        <div>
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(lastOrder.status)][language]}</span>
                                                        </div>
                                                        <div>
                                                            <span>{t.account.refundedAt[language]}</span>
                                                            <span>{new Date(lastOrder.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(lastOrder.status)][language]}</span>
                                                        </div>
                                                        <div>
                                                            <span>{t.account.updatedAt[language]}</span>
                                                            <span>{new Date(lastOrder.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className="order-img-block order-img-block-principal">
                                                {Array.isArray(lastOrder?.order_item) && lastOrder.order_item.map((item, index) => (
                                                    <img style={{
                                                        marginRight: "10px",
                                                    }}
                                                         src={`${API_URL}${item.item.item.image}`} height={90}
                                                         key={index} alt={`alt-img-${index}`}/>
                                                ))}
                                                {Array.isArray(lastOrder?.returned_item) && lastOrder.returned_item.map((item, index) => (
                                                    <img style={{
                                                        marginRight: "10px",
                                                        filter: item?.refund_reason && "brightness(60%)",
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
};

export default Account;