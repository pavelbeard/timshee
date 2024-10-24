import { Fragment } from "react";
import { useSelector } from "react-redux";
import CartBody from "../../components/cart/CartBody";
import CartFooter from "../../components/cart/CartFooter";
import CartHeader from "../../components/cart/CartHeader";
import CartIsEmpty from "../../components/cart/CartIsEmpty";
import CartItems from "../../components/cart/CartItems";
import { selectTotalQuantity } from "../../redux/features/store/cartSlice";

export default function Cart() {
  window.document.title = "Cart | Timshee store";
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <CartBody>
      <CartHeader />
      {totalQuantity > 0 ? (
        <Fragment>
          <CartItems />
          <CartFooter />
        </Fragment>
      ) : (
        <CartIsEmpty />
      )}
    </CartBody>
  );
}
