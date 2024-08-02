import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";

import "./Orders.css";
import t from "../../../translate/TranslateService";
import {toCamelCase} from "../../../api/stuff";
import Nothing from "../../../techPages/Nothing";

import { API_URL } from '../../../../config';
import {selectOrders, setOrders} from "../../../../redux/services/features/account/accountDataSlice";
import {useGetOrdersByUserMutation} from "../../../../redux/services/features/account/accountDataApiSlice";


const Orders = () => {
    const language = t.language();
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const [getOrdersByUser, { isLoading }] = useGetOrdersByUserMutation();

    useEffect(() => {
        if (orders?.length === 0) {
            getOrdersByUser().unwrap().then((res) => dispatch(setOrders(res)))
        }
    }, []);

    return(
        <>
            <div className="return-to-account">
                <Link to="/account/details">{t.account.returnToAccount[language]}</Link>
            </div>
            {orders?.length > 0 ?
                <div className="orders-container">
                    {Array.isArray(orders) &&
                        orders.map((order, index) => (
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
                                    {order?.order_item?.map((item, index) => (
                                        <div key={index}>
                                            <img style={{
                                                marginRight: "10px",
                                            }}
                                                 src={`${API_URL}${item.item.item.image}`} height={90}
                                                 alt={`alt-img-${index}`}/>
                                        </div>
                                    ))}
                                    {order?.returned_item?.map((item, index) => (
                                        <div key={index}>
                                            <img style={{
                                                marginRight: "10px",
                                                filter: item?.refund_reason && "brightness(60%)",
                                            }}
                                                 src={`${API_URL}${item.item.item.image}`} height={90}
                                                 alt={`alt-img-${index}`}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-buttons">
                                    <Link to={`/orders/${order?.second_id}/detail`}>
                                        <div className="order-button">
                                            {t.account.orderDetail[language]}
                                        </div>
                                    </Link>
                                    {
                                        (order?.status !== "refunded" && order?.status !== "partial_refunded"
                                            && order?.non_refundable === false) && (
                                            <Link to={`/orders/${order.second_id}/order-refund`}>
                                                <div
                                                    className="order-button">{t.account.returnOrder[language]}</div>
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                 :
                <Nothing/>
            }
        </>
    )
};

export default Orders;