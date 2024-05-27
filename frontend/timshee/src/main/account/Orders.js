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
                            <div>
                                <span>FOR:</span>
                                {/*<span>{for_}</span>*/}
                            </div>
                            <div>
                                <span>SHIP TO:</span>
                                {/*<span className="ship-to">{shipTo}</span>*/}
                            </div>
                            <div>
                                <span>PHONE NUMBER:</span>
                                <span>±{order.shippingAddress.phoneCode.phoneCode}</span>
                                <span> {order.shippingAddress.phoneNumber}</span>
                            </div>
                            <div><span>STATUS:</span><span>{order.status}</span></div>
                            {
                                order.status === "completed" && (
                                    <div>
                                        <span>DELIVERED AT:</span>
                                        {/*<span>{new Date(deliveredAt).toDateString()}</span>*/}
                                    </div>
                                )
                            }
                            <div className="order-img-block">
                                {order.orderedItems.data.map((item, index) => (
                                    <img style={{marginRight: "10px"}}
                                         src={`${API_URL}${item.stock.item.image}`} height={90}
                                         key={index} alt={`alt-img-${index}`}/>
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