import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrders} from "./forms/reducers/asyncThunks";

import "./Orders.css";
import AuthService from "../api/authService";
import Loading from "../Loading";
import Error from "../Error";

const API_URL = process.env.REACT_APP_API_URL;


const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useDispatch();
    const token = AuthService.getCurrentUser();
    const {orders, ordersStatus} = useSelector(state => state.ordersPage);

    useEffect(() => {
        console.log("Working")
        if (token?.access && ordersStatus === 'idle') {
            dispatch(getOrders({token}));
        }
    }, [ordersStatus]);
    
    if (ordersStatus === 'success') {
        return(
            <>
                <div className="return-to-account">
                    <Link to="/account/details">RETURN TO ACCOUNT</Link>
                </div>
                <div className="orders-container">
                    {
                        orders.map((order, index) => (
                            <div className="item" key={index}>
                                <div className="info-block">{order.orderNumber}</div>
                                <div className="divider"></div>
                                {
                                    order.status === "completed" ? (
                                        <div>
                                            <span>DELIVERED AT:</span>
                                            <span>{new Date(order.updatedAt).toDateString()}</span>
                                        </div>
                                    ) : (
                                        <div className="order-status-orders">
                                            <span>STATUS:</span>
                                            <span>{order.status.replace(/_/, " ")}</span>
                                        </div>
                                    )
                                }
                                <div className="order-img-block order-img-block-principal">
                                    {order.orderedItems.data.map((item, index) => (
                                        <div key={index}>
                                            <img style={{
                                                marginRight: "10px",
                                                filter: item.refunded === true ? "brightness(0.6)" : "none"
                                            }}
                                                 src={`${API_URL}${item.stock.item.image}`} height={90}
                                                 alt={`alt-img-${index}`}/>
                                            <div>Refunded: {item.refunded}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-buttons">
                                    <Link to={`/orders/${order.id}/detail`}>
                                        <div className="order-button">
                                            ORDER DETAIL
                                        </div>
                                    </Link>
                                    <div className="order-button">RETURN AN ORDER</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        )
    } else if (ordersStatus === 'loading') {
        return <Loading />;
    } else if (ordersStatus === 'error') {
        return <Error />;
    }
};

export default Orders;