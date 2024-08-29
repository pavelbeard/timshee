import React, {Fragment} from 'react';
import CartItems from "../../components/cart/CartItems";
import {useSelector} from "react-redux";
import {
    selectTotalQuantity
} from "../../redux/features/store/cartSlice";
import CartBody from "../../components/cart/CartBody";
import CartHeader from "../../components/cart/CartHeader";
import CartIsEmpty from "../../components/cart/CartIsEmpty";
import CartFooter from "../../components/cart/CartFooter";

const CartModal = ({ onClose }) => {
    window.document.title = "Cart | Timshee";
    const totalQuantity = useSelector(selectTotalQuantity);

    return (
        <CartBody onClick={e => e.stopPropagation()}>
            <CartHeader onClose={onClose} />
            {totalQuantity > 0
                ? <Fragment>
                    <CartItems/>
                    <CartFooter/>
                </Fragment>
                : <CartIsEmpty/>
            }
        </CartBody>
    )
};

export default CartModal;
