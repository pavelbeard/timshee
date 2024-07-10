import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrders} from "../forms/reducers/asyncThunks";

import "./Orders.css";
import AuthService from "../../../api/authService";
import Loading from "../../../techPages/Loading";
import Error from "../../../techPages/Error";
import t from "../../../translate/TranslateService";
import {toCamelCase} from "../../../api/stuff";
import Nothing from "../../../techPages/Nothing";

const API_URL = process.env.REACT_APP_API_URL;


const Orders = () => {
    const dispatch = useDispatch();
    const language = t.language();
    const token = AuthService.getCurrentUser();
    const {orders, ordersStatus} = useSelector(state => state.ordersPage);

    useEffect(() => {
        if (token?.access && ordersStatus === 'idle') {
            dispatch(getOrders({token}));
        }
    }, [ordersStatus]);
    
    if (ordersStatus === 'success') {
        return(
            <>
                <div className="return-to-account">
                    <Link to="/account/details">{t.account.returnToAccount[language]}</Link>
                </div>
                {
                    orders.length > 0 ? (
                        <div className="orders-container">
                            {
                                orders.map((order, index) => {
                                    if (order.order_item.length === 0) {
                                        return <></>
                                    }

                                    return (
                                        <div className="item" key={index}>
                                            <div className="info-block">{order?.order_number}</div>
                                            <div className="divider"></div>
                                            {
                                                order.status === "completed" ? (
                                                    <div>
                                                        <span>{t.account.deliveredAt[language]}</span>
                                                        <span>{new Date(order?.updated_at).toDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="order-status-orders">
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(order.status)][language]}</span>
                                                        </div>
                                                        <div className="order-status-orders">
                                                            <span>{t.account.createdAt[language]}</span>
                                                            <span>{new Date(order?.created_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className="order-img-block order-img-block-principal">
                                                {order.order_item.map((item, index) => (
                                                    <div key={index}>
                                                        <img style={{
                                                            marginRight: "10px",
                                                            filter: item.refund_reason !== null ? "brightness(0.6)" : "none"
                                                        }}
                                                             src={`${API_URL}${item.item.item.image}`} height={90}
                                                             alt={`alt-img-${index}`}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-buttons">
                                                <Link to={`/orders/${order.id}/detail`}>
                                                    <div className="order-button">
                                                        {t.account.orderDetail[language]}
                                                    </div>
                                                </Link>
                                                {
                                                    (order.status !== "refunded" && order.status !== "partial_refunded"
                                                    && order.non_refundable === false) && (
                                                        <Link to={`/orders/${order.id}/order-refund`}>
                                                            <div className="order-button">{t.account.returnOrder[language]}</div>
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <Nothing />
                    )
                }
            </>
        )
    } else if (ordersStatus === 'loading') {
        return <Loading />;
    } else if (ordersStatus === 'error') {
        return <Error />;
    }
};

export default Orders;