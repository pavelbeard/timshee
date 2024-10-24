import { Fragment } from "react";
import { useSelector } from "react-redux";
import CartBody from "../../components/cart/CartBody";
import CartFooter from "../../components/cart/CartFooter";
import CartHeader from "../../components/cart/CartHeader";
import CartIsEmpty from "../../components/cart/CartIsEmpty";
import CartItems from "../../components/cart/CartItems";
import { selectTotalQuantity } from "../../redux/features/store/cartSlice";

const CartModal = ({ onClose }) => {
  window.document.title = "Cart | Timshee";
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <CartBody onClick={(e) => e.stopPropagation()}>
      <CartHeader onClose={onClose} />
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
};

export default CartModal;
