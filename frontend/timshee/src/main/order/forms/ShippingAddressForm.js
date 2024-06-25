import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";

import backImg from "../../../media/static_images/back_to.svg"
import {useDispatch, useSelector} from "react-redux";
import {
    setAddressFormObject,
} from "./reducers/shippingAddressFormSlice";
    import {toggleCart} from "../../../redux/slices/menuSlice";
import AuthService from "../../api/authService";
import {getFilteredPhoneCodes, getFilteredProvinces} from "../api/asyncThunks";
import t from "../../translate/TranslateService";

const ShippingAddressForm = ({
     initialValue: addressFormObject,
     setShippingAddressString,
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
    const token = AuthService.getCurrentUser();
    const language = t.language();
    const {
        errorMessage,
        filteredProvinces,
        filteredPhoneCodes,
    } = useSelector(state => state.shippingAddressForm);

    const changeCountry = (e) => {
        const selectedCountryId = parseInt(e.target.value);
        dispatch(getFilteredProvinces({countryId: selectedCountryId}));
        dispatch(getFilteredPhoneCodes({countryId: selectedCountryId}));
        dispatch(setAddressFormObject({
            ...addressFormObject,
            province: provinces.find(province => province.country.id === selectedCountryId),
        }))
    };


    const changeProvince = (e) => {
        const province = filteredProvinces.find(province => province.id === parseInt(e.target.value));
        dispatch(setAddressFormObject({...addressFormObject, province}));
    };

    const changeAddress = (e) => {
        const address = shippingAddresses.find(address => address.id === parseInt(e.target.value));

        if (address === undefined) {
            dispatch(setAddressFormObject(undefined));
        } else {
            dispatch(getFilteredProvinces({countryId: address.province.country.id}));
            dispatch(getFilteredPhoneCodes({countryId: address.phone_code.country}));
            dispatch(setAddressFormObject(address));
            setShippingAddressString(
                `${address?.address1}, ` +
                `${address?.address2}, ` +
                `${address?.postal_code}, ` +
                `${address?.province?.name}, ` +
                `${address?.city}, ` +
                `${address?.province?.country?.name}, ` +
                `${address?.first_name} ${address?.last_name}`
            );
        }
    };

    return(
        <form onSubmit={submit} className="shipping-address-form">
            {errorMessage && <div className="shipping-address-form-error-essage">{errorMessage}</div>}
            <span className="checkout-contact">
                <h3>{t.checkout.contact[language]}</h3>
            </span>
            {
                token?.access ? (
                    <div className="shipping-address-user">
                        <span>{usernameEmail}</span>
                        <span onClick={() => {
                            AuthService.logout();
                            navigate(`/shop/${orderId}/checkout/information`);
                        }}>{t.account.logout[language]}</span>
                    </div>
                ) : (
                    <div className="shipping-addeess-email">
                        <label htmlFor="email">
                            <span className="shipping-address-form-text">Email:</span>
                            <input required id="email" type="email" value={addressFormObject?.email || ""}
                                   onChange={e => dispatch(setAddressFormObject({
                                        ...addressFormObject,
                                       email: e.target.value
                                   }))}/>
                        </label>
                    </div>
                )
            }
            <span className="shipping-address">
                <h3>{t.checkout.shippingAddress[language]}</h3>
            </span>
            <select id="shippingAddresses" value={addressFormObject?.id}
                    onChange={changeAddress}>
                <option value="">New address</option>
                {

                    typeof shippingAddresses.map === "function" && shippingAddresses.map((address) => {
                        return (
                            <option key={address.id} value={address.id}>
                                {
                                    `${address?.address1}, ` +
                                    `${address?.address2}, ` +
                                    `${address?.postal_code}, ` +
                                    `${address?.province?.name}, ` +
                                    `${address?.city}, ` +
                                    `${address?.province?.country?.name}, ` +
                                    `${address?.first_name} ${address?.last_name}`
                                }
                            </option>
                        )
                    })
                }
            </select>
            <div className="shipping-address-country">
                <label htmlFor="country">
                    <span className="shipping-address-form-text">{t.forms.country[language]}</span>
                    <select required size="1" id="country"
                            value={addressFormObject?.province?.country.id || 0}
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
                    <span className="shipping-address-form-text">{t.forms.firstname[language]}</span>
                    <input required id="firstName" type="text" value={addressFormObject?.first_name || ""}
                           onChange={e => dispatch(setAddressFormObject({
                               ...addressFormObject,
                               first_name: e.target.value
                           }))}/>
                </label>
                <label htmlFor="lastName">
                    <span className="shipping-address-form-text">{t.forms.lastname[language]}</span>
                    <input required id="lastName" type="text" value={addressFormObject?.last_name || ""}
                           onChange={e => dispatch(setAddressFormObject({
                                ...addressFormObject,
                               last_name: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="shipping-address-address">
                <label htmlFor="streetAddress">
                    <span className="shipping-address-form-text">{t.forms.streetAddress[language]}</span>
                    <input required id="streetAddress" type="text" value={addressFormObject?.address1 || ""}
                           onChange={e => dispatch(setAddressFormObject({
                               ...addressFormObject,
                               address1: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="shipping-address-apartment">
                <label htmlFor="apartment">
                    <span className="shipping-address-form-text">{t.forms.apartment[language]}</span>
                    <input id="apartment" type="text" value={addressFormObject?.address2 || ""}
                           onChange={e => dispatch(setAddressFormObject({
                               ...addressFormObject,
                               address2: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="shipping-address-location">
                <label htmlFor="postalCode">
                    <span className="shipping-address-form-text">{t.forms.postalCode[language]}</span>
                    <input required id="postalCode" type="text" value={addressFormObject?.postal_code || ""}
                           onChange={e => dispatch(setAddressFormObject({
                               ...addressFormObject,
                               postal_code: e.target.value
                           }))}/>
                </label>
                <label htmlFor="city">
                    <span className="shipping-address-form-text">{t.forms.city[language]}</span>
                    <input required id="city" type="text" value={addressFormObject?.city || ""}
                           onChange={e => dispatch(setAddressFormObject({
                               ...addressFormObject,
                               city: e.target.value
                           }))}/>
                </label>
                <label htmlFor="province">
                    <span className="shipping-address-form-text">{t.forms.province[language]}</span>
                    <select required id="province"
                            value={addressFormObject?.province?.id || 0}
                            onChange={changeProvince}>
                        {filteredProvinces.map((province) => (
                            <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="shipping-address-phone">
                <label htmlFor="phone">
                    <span className="shipping-address-form-text">{t.forms.phoneNumber[language]}</span>
                    <input required id="phone" type="text" value={addressFormObject?.phone_number || ""}
                           onChange={e => dispatch(setAddressFormObject({
                               ...addressFormObject,
                               phone_number: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="form-submit">
                <div>
                    <img src={backImg} alt="alt-back-to-cart" height={14}/>
                    <Link to="/cart" onClick={() => {
                        setCurrentStep(1);
                        dispatch(toggleCart(false));
                    }}>{t.checkout.toCart[language]}</Link>
                </div>
                <button type="submit" onSubmit={submit}>{t.checkout.toShipping[language]}</button>
            </div>
        </form>
    )
};

export default ShippingAddressForm;