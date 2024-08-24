import {useSelector} from "react-redux";
import {
    selectTotalQuantity
} from "../../redux/features/store/cartSlice";
import CartBody from "../../components/cart/CartBody";
import CartHeader from "../../components/cart/CartHeader";
import CartItems from "../../components/cart/CartItems";
import CartIsEmpty from "../../components/cart/CartIsEmpty";
import {Fragment} from "react";
import CartFooter from "../../components/cart/CartFooter";

export default function Cart() {
    window.document.title = "Cart | Timshee store";
    const totalQuantity = useSelector(selectTotalQuantity);

    return (
        <CartBody>
            <CartHeader />
            {totalQuantity > 0
                ? <Fragment>
                    <CartItems />
                    <CartFooter />
                </Fragment>
                : <CartIsEmpty />
            }
        </CartBody>
    );
}