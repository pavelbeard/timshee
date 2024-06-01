import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrderDetail} from "./forms/reducers/asyncThunks";
import Loading from "../Loading";
import Error from "../Error";

import "./Orders.css";
import {OrderDetailContext} from "./OrderRefundContext";
import AuthService from "../api/authService";

const API_URL = process.env.REACT_APP_API_URL;

const OrderDetail = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const token = AuthService.getCurrentUser();
    const {order, orderDetailStatus} = useSelector(state => state.ordersPage);

    const shippingAddress = (address) => {
        return (
            <div>
                <span>{`${address.province.country.name}, ${address.postalCode}, ${address.province.name}, ${address.city}`}</span>
                <br/>
                <span>{`${address.streetAddress}, ${address.apartment}`}</span>
            </div>
        );
    };

    useEffect(() => {
        if (orderDetailStatus === 'idle') {
            dispatch(getOrderDetail({orderId: params.orderId, token}));
        }

    }, [orderDetailStatus]);

    if (orderDetailStatus === 'success') {
        return (
            <div className="order-detail-container">
                <div className="order-detail-number">{order.orderNumber}</div>
                <div className="order-detail-status">{order.status.replace(/_/, ' ')}</div>
                <div className="order-detail-shipping-address">
                    <span>TO:</span>
                    {shippingAddress(order.shippingAddress)}
                </div>
                <div className="order-img-block order-img-block-detail">
                    {
                        order.orderedItems.data.map((item, index) => (
                            <div key={index}>
                                <img height={180}
                                     style={{
                                         marginRight: "10px",
                                         filter: item.refunded ? "brightness(0.6)" : "none"
                                     }}
                                     src={`${API_URL}${item.stock.item.image}`}
                                     alt={`alt-image-${index}`}/>
                                <div>
                                    <span>{item.stock.item.name}</span>
                                    <span>{item.stock.item.price}</span>
                                </div>
                                <div>
                                    <span>QUANTITY:</span>
                                    <span>{item.quantity}</span>
                                </div>
                                <div>
                                    <Link to={`/orders/${order.id}/order-refund/${item.stock.id}/${item.quantity}`}>
                                        REFUND ITEM
                                    </Link>
                                </div>
                            </div>

                        ))
                    }
                </div>
    </div>
    )
    } else if (orderDetailStatus === 'loading') {
        return <Loading/>;
    } else if (orderDetailStatus === 'error') {
        return <Error/>;
    }
};

export default OrderDetail;