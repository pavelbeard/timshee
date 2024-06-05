import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrderDetail} from "./forms/reducers/asyncThunks";
import Loading from "../Loading";
import Error from "../Error";

import "./Orders.css";
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
                    <span>NUMBER:</span>
                    <span>{order.order_number}</span>
                </div>
                <div className="order-detail-status order-detail-info">
                    <span>STATUS:</span>
                    <span>{order.status.replace(/_/, ' ')}</span>
                </div>
                <div className="order-detail-shipping-address order-detail-info">
                    <span>TO:</span>
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
                                    <span>{item.item.item.price}</span>
                                </div>
                                <div className="order-detail-item-info">
                                    {
                                        item.quantity > 1 && (
                                            <>
                                                <span>QUANTITY:</span>
                                                <span>{item.quantity}</span>
                                            </>
                                        )
                                    }
                                </div>
                                <div className="order-refund-item">
                                    {
                                        item.refund_reason === null ? (
                                            <Link to={`/orders/${order.id}/order-refund/${item.item.id}/${item.quantity}`}>
                                                REFUND ITEM
                                            </Link>
                                        ) : item.quantity > 0 && (
                                            <p>FURTHER REFUND OF THIS ITEM IS AVAILABLE ONLY THROUGH A MAIL LETTER</p>
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
                            <Link to="/account/details/orders">
                                <div className="order-button">Return to orders page</div>
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