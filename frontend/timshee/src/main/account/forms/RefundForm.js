import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {refundPartial, refundWhole} from "./reducers/asyncThunks";
import AuthService from "../../api/authService";
import {resetRefundStatus} from "./reducers/ordersSlice";
import {Link, useNavigate, useParams} from "react-router-dom";

import back from "../../../media/static_images/back_to.svg"

import "./Forms.css";

const RefundForm = ({orderNumber, stockId=0, stockQuantity=0}) => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const token = AuthService.getCurrentUser();
    const {orderRefundWholeStatus, orderRefundPartialStatus} = useSelector(state => state.ordersPage);
    const [reason, setReason] = React.useState({id: 0, reason: "It didn't like"});
    const [quantity, setQuantity] = React.useState(1);

    const handleSubmit = e => {
        e.preventDefault();

        const data = {
            "stock_item_id": stockId,
            "quantity": reason.id === 6 ? quantity : stockQuantity,
            "quantity_total": stockQuantity,
            "reason": reason,
        }

        if (stockId === 0 || stockId === undefined) {
            dispatch(refundWhole({data, orderNumber, token}));
        } else {
            dispatch(refundPartial({data, orderNumber, token}));
        }

    };

    if (orderRefundWholeStatus === 'success' ||
        orderRefundPartialStatus === 'success') {
        return (
            <div className="order-partial-refund-form order-refunded">
                <h3>ORDER HAS BEEN REFUNDED</h3>
                {
                    token?.access && (
                        <div className="order-buttons">
                            <Link to="/account/details/orders">
                                <div className="order-button" onClick={() => dispatch(resetRefundStatus())}>
                                    RETURN TO ORDERS
                                </div>
                            </Link>
                        </div>
                    )
                }
            </div>
        )
    } else {
        return (
            <div className="order-partial-refund-form">
                <form onSubmit={handleSubmit}>
                    <span>
                        <Link to={`/orders/${params.orderId}/detail`} style={{
                            textDecoration: "none",
                            color: "black",
                            cursor: "pointer",
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <img src={back} alt="alt-back" height={15} style={{
                                    marginRight: "10px",
                                }}/>
                                <span style={{
                                    fontSize: "24px",
                                    fontVariant: "all-petite-caps",
                                }}>BACK TO ORDER</span>
                            </div>
                        </Link>
                    </span>
                    <span><h1>REFUND FORM</h1></span>
                    <span><h3>WHY YOU WANT REFUND THIS ITEM?</h3></span>
                    <div>
                        <label htmlFor="didnt-like">
                            <span>It didn't like</span>
                            <input id="didnt-like" type="radio"
                                required={0 === reason.id}
                                checked={0 === reason.id}
                                   onChange={() => setReason({id: 0, reason: "It didn't like"})}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="color-size-isnt-correct">
                            <span>Item's color/size isn't correct</span>
                            <input id="color-size-isnt-correct" type="radio"
                                required={1 === reason.id}
                                checked={1 === reason.id}
                                   onChange={() => setReason({id: 1, reason: "Item's color/size isn't correct"})}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="wrong-description">
                            <span>Item doesn't match the description in the store</span>
                            <input id="wrong-description" type="radio"
                                required={2 === reason.id}
                                checked={2 === reason.id}
                                   onChange={() => setReason({
                                       id: 2,
                                       reason: "Item doesn't match the description in the store"
                                   })}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="appearance">
                            <span>Dissatisfaction with appearance</span>
                            <input id="appearance" type="radio"
                                required={3 === reason.id}
                                checked={3 === reason.id}
                                   onChange={() => setReason({id: 3, reason: "Dissatisfaction with appearance"})}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="long-shipping">
                            <span>Shipping is very long</span>
                            <input id="long-shipping" type="radio"
                                required={4 === reason.id}
                                checked={4 === reason.id}
                                   onChange={() => setReason({id: 4, reason: "Shipping is very long"})}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="order-errors">
                            <span>Wrong item ordered</span>
                            <input id="order-errors" type="radio"
                                required={5 === reason.id}
                                checked={5 === reason.id}
                                   onChange={() => setReason({id: 5, reason: "Wrong item ordered"})}
                            />
                        </label>
                    </div>
                    <div>
                        {
                            stockId > 0 && (
                                <>
                                    <div>
                                        <label htmlFor="wrong-quantity">
                                            <span>I ordered more items than I wanted</span>
                                            <input id="wrong-quantity" type="radio"
                                                   required={6 === reason.id}
                                                   checked={6 === reason.id}
                                                   onChange={() => setReason({
                                                       id: 6,
                                                       reason: "I ordered more items than I wanted"
                                                   })}
                                            />
                                        </label>
                                    </div>
                                    {
                                        reason.id === 6 && (
                                            <div>
                                                <label htmlFor="wrong-quantity-counter">
                                                    <span>Quantity for refund:</span>
                                                    <div>
                                                        <span>min: {quantity}</span>
                                                        <input id="wrong-quantity-counter" type="range"
                                                               value={quantity}
                                                               min={stockQuantity === 1 ? "0" : "1"}
                                                               disabled={stockQuantity === 1}
                                                               max={`${stockQuantity}`}
                                                               onChange={e => {
                                                                   setQuantity(parseInt(e.target.value));
                                                               }}
                                                        />
                                                        <span>max: {stockQuantity}</span>
                                                    </div>
                                                </label>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }

                    </div>
                    <div>
                        <label htmlFor="other">
                            <span>Other reasons</span>
                            <textarea id="other"
                                      required={7 === reason.id}
                                      onClickCapture={() => setReason({id: 7, reason: ""})}
                                      onChange={e => setReason({id: 7, reason: e.target.value})}
                            />
                        </label>
                        <div className="order-partial-refund-item-button">
                            <button onSubmit={handleSubmit}>REFUND ITEM</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
};

export default RefundForm;