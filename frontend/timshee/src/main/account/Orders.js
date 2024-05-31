import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrders} from "./forms/reducers/asyncThunks";
import OrderDetail from "./OrderDetail";

import "./Orders.css";


const API_URL = process.env.REACT_APP_API_URL;


const Orders = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const {orders} = useSelector(state => state.ordersPage);

    useEffect(() => {
        dispatch(getOrders());
    }, []);
    
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
                                    <div><span>STATUS:</span><span>{order.status.replace(/_/, " ")}</span></div>
                                )
                            }
                            <div className="order-img-block">
                                {order.orderedItems.data.map((item, index) => (
                                    <div key={index}>
                                        <img style={{
                                            marginRight: "10px",
                                            filter: item.refunded ? "brightness(0.6)" : "none"
                                        }}
                                             src={`${API_URL}${item.stock.item.image}`} height={90}
                                             alt={`alt-img-${index}`}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
};

export default Orders;