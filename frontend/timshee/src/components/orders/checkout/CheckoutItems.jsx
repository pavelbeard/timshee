import CheckoutItem from "./CheckoutItem";

const CheckoutItems = ({ orderItems }) => {
    return orderItems?.map((item, idx) => (
        <CheckoutItem key={idx} item={item} />
    ));
};

export default CheckoutItems;