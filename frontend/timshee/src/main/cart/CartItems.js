import {useSelector} from "react-redux";
import React from "react";
import {changeQuantity, clearCart, deleteCartItems, getCartItems} from "./api/asyncThunks";
import {resetAddCartItemStatus} from "./reducers/cartSlice";
import AuthService from "../api/authService";

const API_URL = process.env.REACT_APP_API_URL;

const CartItems = ({cart, dispatch}) => {
    const token = AuthService.getCurrentUser();

    const {orderId} = useSelector(state => state.order);

    const findItem = (itemSrc) => {
        return JSON.parse(localStorage.getItem("items"))
            .filter(item => item.id === itemSrc.stock.item.id)[0];
    };

    const changeQuantityComponent = (item, increaseStock) => {
        dispatch(changeQuantity({itemSrc: item, increaseStock, token, orderId}));
        dispatch(resetAddCartItemStatus('idle'));
    };

    // that one is deleting all items if itemId undefined or one item with an id
    const removeItems = ({item, stockId = 0}) => {
        if (stockId === 0) {
            dispatch(clearCart({token, hasOrdered: false}))
        } else {
            dispatch(changeQuantity({itemSrc: item, increaseStock: true, token, quantity: item.quantity}));
        }
        dispatch(resetAddCartItemStatus('idle'));
    };

    const setItemUrl = (item) => {
        return `/shop/${item.stock.item.collection.link}/${item.stock.item.type.name.replace(/ /g, "-").toLowerCase()}`
                        + `/${item.stock.item.name.replace(/ /g, "-").toLowerCase()}`;
    };

    return (
        <div className="cart-items">
            {
                cart.cartItems.map((item, index) => {
                    return (
                        <div className="cart-item-container" key={index}>
                            <div className="cart-item-image">
                                <img src={API_URL + item.stock.item.image} alt={`alt-image-${index}`}
                                     height={256}/>
                            </div>
                            <div className="cart-item-props">
                                {/**/}
                                {/*Will have a realization so far*/}
                                {/*<Link to={itemUrl} onClick={*/}
                                {/*    () => {*/}
                                {/**/}
                                {/*        dispatch(setItemData({...findItem(item)}));*/}
                                {/*    }*/}
                                {/*}>{item.stock.item.name}</Link>*/}
                                <div className="cart-item-name">{item.stock.item.name}</div>
                                <div className="cart-item-price">{item.stock.item.price}</div>
                                <div className="cart-item-size">{item.stock.size.value}</div>
                                <div className="cart-item-color">{item.stock.color.name}</div>
                                <div className="cart-item-quantity">
                                    <div className="change-quantity"
                                         onClick={() => changeQuantityComponent(item, true)}>-</div>
                                    <div>{item.quantity}</div>
                                    <div className="change-quantity"
                                         onClick={() => changeQuantityComponent(item, false)}>±</div>
                                    <div className="cart-item-remove"
                                         onClick={() => removeItems({
                                             stockId: item.stock.id, item
                                         })}>Remove</div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            {
                cart.cartItems.length > 0 &&
                <div className="cart-item-remove" onClick={() => removeItems({})}>
                    Remove all
                </div>
            }
        </div>
    )
};

export default CartItems;