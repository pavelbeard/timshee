import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";

import backImg from "../../../media/static_images/back_to.svg"
import {useDispatch, useSelector} from "react-redux";
import {
    setAddressId,
    setAddressObject, setErrorMessage, setPhoneCode, setPhoneCodesFiltered,
    setProvince, setProvincesFiltered,
    setShippingAddress
} from "./reducers/shippingAddressFormSlice";
    import {toggleCart} from "../../../redux/slices/menuSlice";
import AuthService from "../../api/authService";

const ShippingAddressForm = ({
     initialValue: addressObject,
     shippingAddresses,
     usernameEmail,
     orderId,
     countries,
     phoneCodes,
     provinces,
     setCurrentStep,
     submit
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = AuthService.isAuthenticated();
    const {
        errorMessage,
        provincesInternal,
        shippingAddressString
    } = useSelector(state => state.shippingAddressForm);

    const changeCountry = (e) => {
        const selectedCountryId = parseInt(e.target.value);

        const phoneCodesInternalTmp = phoneCodes.filter(phoneCode =>
            phoneCode.country === selectedCountryId
        );

        const provincesInternalTmp = provinces.filter(province =>
            province.country.id === selectedCountryId
        );

        dispatch(setPhoneCodesFiltered(phoneCodesInternalTmp));
        dispatch(setProvincesFiltered(provincesInternalTmp));

        dispatch(setProvince(provincesInternalTmp[0]));
        dispatch(setPhoneCode(phoneCodesInternalTmp[0]));
    };

    const changeProvince = (e) => {
        const province = provinces.filter(province =>
            province.id === parseInt(e.target.value)
        );

        dispatch(setProvince(province[0]));
    };

    const changeAddress = (e) => {
        try {
            const address = shippingAddresses.filter(address =>
                address.id === parseInt(e.target.value)
            ).at(0);

            dispatch(setShippingAddress(address.id))
            dispatch(setAddressId(address.id));
            dispatch(setAddressObject(address));
        } catch (e) {
            dispatch(setErrorMessage(e.message));
        }
    };

    const changeTheRest = data => {
        console.log(data);
        dispatch(setAddressObject(data));
    }

    useEffect(() => {
        if (addressObject) {
            const provincesTmp = provinces.filter(province =>
                province.country.name === countries[0].name
            );

            const phoneCodesTmp = phoneCodes.filter(phoneCode =>
                phoneCode.country === countries[0].id
            );

            dispatch(setPhoneCodesFiltered(phoneCodesTmp));
            dispatch(setProvincesFiltered(provincesTmp));

            dispatch(setPhoneCode({
                phoneCode: phoneCodesTmp[0].phone_code,
                country: phoneCodesTmp[0].country
            }));
            dispatch(setProvince({
                id: provincesTmp[0].id,
                name: provincesTmp[0].name,
                country: provincesTmp[0].country
            }));
        }
    }, []);

    return(
        <form onSubmit={submit} className="shipping-address-form">
            {errorMessage && <div className="shipping-address-form-error-essage">{errorMessage}</div>}
            <span className="checkout-contact">
                <h3>Contact</h3>
            </span>
            {
                isAuthenticated ? (
                    <div className="shipping-address-user">
                        <span>{usernameEmail}</span>
                        <span onClick={() => {
                            AuthService.logout();
                            navigate(`/shop/${orderId}/checkout/information`);
                        }}>Logout</span>
                    </div>
                ) : (
                    <div className="shipping-addeess-email">
                        <label htmlFor="email">
                            <span className="shipping-address-form-text">Email:</span>
                            <input required id="email" type="email" value={addressObject?.email || ""}
                                   onChange={e => changeTheRest({email: e.target.value})}/>
                        </label>
                    </div>
                )
            }
            <span className="shipping-address">
                <h3>Shipping address</h3>
            </span>
            <select id="shippingAddresses" value={shippingAddressString} onChange={changeAddress}>
                <option value="">New address</option>
                {typeof shippingAddresses?.map === "function" && shippingAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                        {`${address.streetAddress}, ${address.apartment}, ${address.postalCode}, ${address.province.name}, ${
                            address.city
                        }, ${address.province.country.name}, ${address.firstName} ${address.lastName}`}
                    </option>
                ))}
            </select>
            <div className="shipping-address-country">
                <label htmlFor="country">
                    <span className="shipping-address-form-text">Country/region</span>
                    <select required size="1" id="country"
                            value={addressObject?.province?.country.id || 0}
                            aria-placeholder="Country/region"
                            onChange={changeCountry}>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="shipping-address-name">
                <label htmlFor="firstName">
                    <span className="shipping-address-form-text">First name:</span>
                    <input required id="firstName" type="text" value={addressObject?.firstName || ""}
                           onChange={e => changeTheRest({firstName: e.target.value})}/>
                </label>
                <label htmlFor="lastName">
                    <span className="shipping-address-form-text">Last name</span>
                    <input required id="lastName" type="text" value={addressObject?.lastName || ""}
                           onChange={e => changeTheRest({lastName: e.target.value})}/>
                </label>
            </div>
            <div className="shipping-address-address">
                <label htmlFor="streetAddress">
                    <span className="shipping-address-form-text">Street and house number</span>
                    <input required id="streetAddress" type="text" value={addressObject?.streetAddress || ""}
                           onChange={e => changeTheRest({streetAddress: e.target.value})}/>
                </label>
            </div>
            <div className="shipping-address-apartment">
                <label htmlFor="apartment">
                    <span className="shipping-address-form-text">Apartment (optional)</span>
                    <input id="apartment" type="text" value={addressObject?.apartment || ""}
                           onChange={e => changeTheRest({apartment: e.target.value})}/>
                </label>
            </div>
            <div className="shipping-address-location">
                <label htmlFor="postalCode">
                    <span className="shipping-address-form-text">Postal Code</span>
                    <input required id="postalCode" type="text" value={addressObject?.postalCode || ""}
                           onChange={e => changeTheRest({postalCode: e.target.value})}/>
                </label>
                <label htmlFor="city">
                    <span className="shipping-address-form-text">City</span>
                    <input required id="city" type="text" value={addressObject?.city || ""}
                           onChange={e => changeTheRest({city: e.target.value})}/>
                </label>
                <label htmlFor="province">
                    <span className="shipping-address-form-text">Province/state</span>
                    <select required id="province"
                            value={addressObject?.province?.id || 0}
                            onChange={changeProvince}>
                        {provincesInternal.map((province) => (
                            <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="shipping-address-phone">
                <label htmlFor="phone">
                    <span className="shipping-address-form-text">Phone:</span>
                    <input required id="phone" type="text" value={addressObject?.phoneNumber || ""}
                           onChange={e => changeTheRest({phoneNumber: e.target.value})}/>
                </label>
            </div>
            <div className="form-submit">
                <div>
                    <img src={backImg} alt="alt-back-to-cart" height={14}/>
                    <Link to="/cart" onClick={() => {
                        setCurrentStep("information");
                        dispatch(toggleCart(false));
                    }}>Return to cart</Link>
                </div>
                <button type="submit" onSubmit={submit}>
                    Continue to shipping
                </button>
            </div>
        </form>
    )
};

export default ShippingAddressForm;