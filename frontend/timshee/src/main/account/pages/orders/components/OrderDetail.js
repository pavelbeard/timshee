import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrderDetail} from "../../forms/reducers/asyncThunks";
import Loading from "../../../../techPages/Loading";
import Error from "../../../../techPages/Error";

import "../Orders.css";
import AuthService from "../../../../api/authService";
import t from "../../../../translate/TranslateService";
import {toCamelCase} from "../../../../api/stuff";

const API_URL = process.env.REACT_APP_API_URL;

const OrderDetail = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const token = AuthService.getCurrentUser();
    const language = t.language();
    const {order, orderDetailStatus} = useSelector(state => state.ordersPage);

    const shippingAddress = (address) => {
        return (
            <div>
                <span>{`${address.province.country.name}, ${address.postal_code}, ${address.province.name}, ${address.city}`}</span>
                <br/>
                <span>{`${address.address1}, ${address.address2}`}</span>
            </div>
        );
    };

    useEffect(() => {
        dispatch(getOrderDetail({orderId: params.orderId, token}));
    }, []);

    if (orderDetailStatus === 'success') {
        return (
            <div className="order-detail-container">
                <div className="order-detail-number order-detail-info">
                    <span>{t.account.orderNumber[language]}</span>
                    <span>{order.order_number}</span>
                </div>
                <div className="order-detail-status order-detail-info">
                    <span>{t.account.status[language]}</span>
                    <span>{t.account.orders.status[toCamelCase(order.status)][language]}</span>
                </div>
                <div className="order-detail-shipping-address order-detail-info">
                    <span>{t.account.to[language]}</span>
                    {shippingAddress(order.shipping_address)}
                </div>
                <div className="order-img-block order-img-block-detail ">
                    {
                        order.order_item.map((item, index) => (
                            <div key={index}>
                                <img height={180}
                                     style={{
                                         padding: "10px",
                                         filter: item.refund_reason !== null ? "brightness(0.6)" : "none"
                                     }}
                                     src={`${API_URL}${item.item.item.image}`}
                                     alt={`alt-image-${index}`}/>
                                <div className="order-detail-item-info">
                                    <span>{item.item.item.name}</span>
                                    <span>{item.item.item.price}
                                        <span>{t.shop.price[language]}</span>
                                    </span>
                                </div>
                                <div className="order-detail-item-info">
                                    {
                                        item.quantity > 1 && (
                                            <>
                                                <span>{t.account.quantity[language]}</span>
                                                <span>{item.quantity}</span>
                                            </>
                                        )
                                    }
                                </div>
                                <div className="order-refund-item">
                                    {
                                        item.refund_reason === null && order.non_refundable === false ? (
                                            <Link to={`/orders/${order.id}/order-refund/${item.item.id}/${item.quantity}`}>
                                                {t.account.returnItem[language]}
                                            </Link>
                                        ) : item.quantity > 0 && (
                                            <p>{t.account.returnThroughMail[language]}</p>
                                        )
                                    }
                                </div>
                            </div>

                        ))
                    }
                </div>
                {
                    token?.access && (
                        <div className="order-buttons">
                            <Link to={`/account/details/orders`}>
                                <div className="order-button">{t.account.returnToOrders[language]}</div>
                            </Link>
                        </div>
                    )
                }
        </div>
    )
    } else if (orderDetailStatus === 'loading') {
        return <Loading/>;
    } else if (orderDetailStatus === 'error') {
        return <Error/>;
    }
};

export default OrderDetail;