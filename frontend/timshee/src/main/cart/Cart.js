import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {toggleCart} from "../../redux/slices/menuSlice";

import "../Main.css";
import "./Cart.css";
import close from "../../media/static_images/cruz.svg";
import Cookies from "js-cookie";
import {
    changeQuantity,
    deleteCartItems,
    getCartItems,
    getQuantityOfCart, setHasAdded,
} from "../../redux/slices/shopSlices/itemSlice";

const API_URL = process.env.REACT_APP_API_URL;

const CartItems = ({data, dispatch}) => {
    const csrftoken = Cookies.get("csrftoken");
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {hasChanged} = useSelector(state => state.item);

    const [quantityList, setQuantityList] = React.useState([]);

    const findItem = (itemSrc) => {
        return JSON.parse(localStorage.getItem("items"))
            .filter(item => item.id === itemSrc.stock.item.id)[0];
    };

    const changeQuantityComponent = (item, increase) => {
        dispatch(changeQuantity({itemSrc: item, increase, isAuthenticated}));
        dispatch(getQuantityOfCart({isAuthenticated}));
        dispatch(getCartItems({isAuthenticated}));
        dispatch(setHasAdded(false));
    };

    // that one is deleting all items if itemId undefined or one item with an id
    const removeItems = (itemId=0) => {
        dispatch(deleteCartItems({
            isAuthenticated,
            itemId
        }));
        dispatch(getQuantityOfCart({isAuthenticated}));
        dispatch(getCartItems({isAuthenticated}));
        dispatch(setHasAdded(false));
    };

    useEffect(() => {
        //
        // I'M GOING TO UPGRADE THIS SECTION
        if (data.length > 0) {
            const newQuantityList = data.map(item => ({
                itemId: item.id, quantityInCart: item.quantity_in_cart,
            }));
            setQuantityList(newQuantityList);
        }
    }, [data, hasChanged, isAuthenticated]);

    return (
        <div className="cart-items">
            {
                typeof data.map === "function" && data.map((item, index) => {
                    const itemUrl = `/shop/${item.stock.item.collection.link}/${item.stock.item.type.name.replace(/ /g, "-").toLowerCase()}`
                        + `/${item.stock.item.name.replace(/ /g, "-").toLowerCase()}`;
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
                                         onClick={() =>
                                             changeQuantityComponent(item, false)}
                                    >-
                                    </div>
                                    <div>{quantityList[index]?.quantityInCart}</div>
                                    <div className="change-quantity"
                                         onClick={() =>
                                             changeQuantityComponent(item, true)}
                                    >±
                                    </div>
                                    <div className="cart-item-remove" onClick={
                                        () => removeItems(item.id)
                                    }>Remove
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            {
                data.length > 0 &&
                <div className="cart-item-remove" onClick={() => removeItems()}>
                    Remove all
                </div>
            }
        </div>
    )
};

const Cart = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {cartItems, hasDeleted} = useSelector(state => state.item);

    useEffect(() => {
        dispatch(getCartItems({isAuthenticated}));
    }, [isAuthenticated, hasDeleted]);

    return(
        <div className="overlay cart-container">
            <div className="cart-empty-space" onClick={() => dispatch(toggleCart())}></div>
            <div className="cart">
                <div className="cart-header">
                    <div>Your cart</div>
                    <img src={close} alt="alt-close-cart" height={20} onClick={() => dispatch(toggleCart())}/>
                </div>
                <CartItems data={cartItems} dispatch={dispatch} />
                <div className="cart-footer">
                    <div></div>
                    <div className="terms-and-conditions">
                        <div>Shipping and taxes calculated at checkout</div>
                        <label>
                            <input id="privacy" type="checkbox"/>
                            <span>I have read the <Link className="privcay" to="/privacy-information">Privacy Information Notice</Link></span>
                        </label>
                    </div>
                    <div className="cart-checkout">
                        {cartItems.reduce((acc, item) => {
                            return acc + (parseFloat(item.stock.item.price) * parseFloat(item.quantity_in_cart));
                        }, 0)}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Cart;