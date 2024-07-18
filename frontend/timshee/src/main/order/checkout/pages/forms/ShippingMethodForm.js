import React, {useEffect} from "react";
import backImg from "../../../../../media/static_images/back_to.svg";
import {Link, useParams} from "react-router-dom";

import "./CheckoutForms.css";
import {setShippingMethod} from "./reducers/shippingAddressFormSlice";
import {useDispatch, useSelector} from "react-redux";
import t from "../../../../translate/TranslateService";
import { putShippingMethod } from "./lib";
import AuthService from "../../../../api/authService";
import {getOrderDetail, updateOrderShippingMethod} from "../../../api/asyncThunks";

const ShippingMethodForm = ({
    initialValue: shippingMethods,
    orderId,
    setCurrentStep,
    setShippingPrice,
    setShippingMethodExternal,
    submit
}) => {
    const dispatch = useDispatch();
    const language = t.language();
    const token = AuthService.getCurrentUser();
    const {order} = useSelector(state => state.shippingAddressForm);

    const [selectedShippingMethod, setSelectedShippingMethod] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await putShippingMethod({
            orderId: orderId,
            data: {
                shipping_method: selectedShippingMethod,
            },
            token: token
        });

        if (typeof result === "boolean") {
            dispatch(getOrderDetail({
                orderId: orderId,
                token: token
            }));
            submit();
        } else {
            setErrorMessage(result.message);
        }
    }


    useEffect(() => {
        if (order && order.shipping_method) {
            setShippingMethodExternal(order?.shipping_method?.id);
            setShippingPrice(order?.shipping_method?.price || 0.00);
        }
    }, [order]);

    if (shippingMethods.length > 0) {
        return(
            <form onSubmit={handleSubmit}>
                <span className="shipping-address">
                    <h3>{t.checkout.shippingMethod[language]}</h3>
                </span>
                {shippingMethods.map((method, index) => (
                    <div className="shipping-method" key={index}>
                        <label htmlFor={`method-${method.id}`}>
                            <input required={method.checked}
                                   type="radio"
                                   value={method.id}
                                   checked={method.checked}
                                   onChange={e => {
                                       setShippingMethodExternal(parseInt(e.target.value));
                                       setSelectedShippingMethod(parseInt(e.target.value));
                                       dispatch(setShippingMethod(parseInt(e.target.value)));
                                       setShippingPrice(method.price);
                                   }}/>
                            <span>{method.shipping_name}</span>
                        </label>
                        <div className="shipping-price">{method.price === "0.00" ? "Free" : method.price}
                            <span>{t.shop.price[language]}</span>
                        </div>
                    </div>
                ))}
                <div className="form-submit">
                    <div>
                        <img src={backImg} alt="alt-back-to-info" height={14}/>
                        <Link to={`/shop/${orderId}/checkout`} onClick={
                            () => setCurrentStep(1)
                        }>
                            {t.checkout.toInformation[language]}
                        </Link>
                    </div>
                    <button type="submit">
                        {t.checkout.toPayment[language]}
                    </button>
                </div>
                {errorMessage && (
                    <div className="text-red text-lg">{errorMessage}</div>
                )}
            </form>
        )
    } else {
        return (
            <div>
                {t.stuff.loading[language]}
            </div>
        )
    }
};

export default ShippingMethodForm;