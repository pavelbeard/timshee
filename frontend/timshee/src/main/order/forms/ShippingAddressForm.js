import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";

import backImg from "../../../media/static_images/back_to.svg"
import {
    resetOrderId, updateOrderShippingAddress
} from "../../../redux/slices/shopSlices/orderSlice";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../redux/slices/checkAuthSlice";
import {getEmail} from "../../account/api";
import {
    setAddressId,
    setAddressObject, setErrorMessage, setPhoneCode,
    setPhoneCodesFiltered, setProvince, setProvincesFiltered,
    setShippingAddress, setShippingAddresses, setUsernameEmail
} from "./reducers/shippingAddressFormSlice";
import {getShippingAddressAsTrue, getShippingAddresses} from "./reducers/asyncThunks";
import {toggleCart} from "../../../redux/slices/menuSlice";

const ShippingAddressForm = ({ orderId, countries, phoneCodes, provinces, setCurrentStep }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isValid);
    const {addresses} = useSelector((state) => state.order);
    const {
        shippingAddress, addressObject, addressId,
        errorMessage, shippingAddresses,
        usernameEmail, provincesInternal,
    } = useSelector(state => state.shippingAddressForm);

    // get shipping address if exists
    useEffect(() => {
        dispatch(getShippingAddresses({isAuthenticated}));
        dispatch(getShippingAddressAsTrue({isAuthenticated}));

        const fetchEmail = async () => {
            if (isAuthenticated) {
                const emailInternal = await getEmail();
                dispatch(setUsernameEmail(emailInternal));
            }
        };

        if (addresses !== undefined && addresses.length > 0) {
            dispatch(setShippingAddresses(addresses));
        }

        fetchEmail();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            "first_name": addressObject.firstName,
            "last_name": addressObject.lastName,
            "city": addressObject.city,
            "address1": addressObject.streetAddress,
            "address2": addressObject.apartment,
            "postal_code": addressObject.postalCode,
            "phone_number": addressObject.phoneNumber,
            "email": addressObject.email,
            "additional_data": "",
            "province": addressObject.province.id,
            "phone_code": addressObject.phoneCode.country
        }

        if (isAuthenticated) {
            data["as_primary"] = true;
        }

        dispatch(updateOrderShippingAddress({
            orderId, shippingAddress:
            data, shippingAddressId: addressId,
            isAuthenticated: isAuthenticated
        }));
        setCurrentStep("shipping");
        navigate(`/shop/${orderId}/checkout/shipping`);
    };

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

            dispatch(setAddressObject({
                ...addressObject,
                phoneCode: phoneCodesTmp[0],
                province: provincesTmp[0]
            }));
        }
    }, []);

    return(
        <form onSubmit={handleSubmit} className="shipping-address-form">
            {errorMessage && <div className="shipping-address-form-error-essage">{errorMessage}</div>}
            <span className="checkout-contact">
                <h3>Contact</h3>
            </span>
            {
                isAuthenticated ? (
                    <div className="shipping-address-user">
                        <span>{usernameEmail}</span>
                        <span onClick={() => dispatch(logout())}>Logout</span>
                    </div>
                ) : (
                    <div className="shipping-addeess-email">
                        <label htmlFor="email">
                            <span className="shipping-address-form-text">Email:</span>
                            <input required id="email" type="email" value={addressObject.email}
                                   onChange={e => dispatch(setAddressObject({
                                       ...addressObject,
                                       email: e.target.value
                                   }))}/>
                        </label>
                    </div>
                )
            }
            <span className="shipping-address">
                <h3>Shipping address</h3>
            </span>
            <select id="shippingAddresses" value={shippingAddress} onChange={changeAddress}>
                <option value="">New address</option>
                {shippingAddresses.map((address) => (
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
                            value={addressObject?.province.country.id || 0}
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
                           onChange={e => dispatch(setAddressObject({
                               ...addressObject,
                               firstName: e.target.value
                           }))}/>
                </label>
                <label htmlFor="lastName">
                    <span className="shipping-address-form-text">Last name</span>
                    <input required id="lastName" type="text" value={addressObject?.lastName || ""}
                           onChange={e => dispatch(setAddressObject({
                               ...addressObject,
                               lastName: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="shipping-address-address">
                <label htmlFor="streetAddress">
                    <span className="shipping-address-form-text">Street and house number</span>
                    <input required id="streetAddress" type="text" value={addressObject?.streetAddress || ""}
                           onChange={e => dispatch(setAddressObject({
                               ...addressObject,
                               streetAddress: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="shipping-address-apartment">
                <label htmlFor="apartment">
                    <span className="shipping-address-form-text">Apartment (optional)</span>
                    <input id="apartment" type="text" value={addressObject?.apartment || ""}
                           onChange={e => dispatch(setAddressObject({
                               ...addressObject,
                               apartment: e.target.value
                           }))}/>
                </label>
            </div>
            <div className="shipping-address-location">
                <label htmlFor="postalCode">
                    <span className="shipping-address-form-text">Postal Code</span>
                    <input required id="postalCode" type="text" value={addressObject?.postalCode || ""}
                           onChange={e => dispatch(
                               setAddressObject({
                                   ...addressObject,
                                   postalCode: e.target.value
                               })
                           )}/>
                </label>
                <label htmlFor="city">
                    <span className="shipping-address-form-text">City</span>
                    <input required id="city" type="text" value={addressObject?.city || ""}
                           onChange={e => dispatch(setAddressObject({
                               ...addressObject,
                               city: e.target.value
                           }))}/>
                </label>
                <label htmlFor="province">
                    <span className="shipping-address-form-text">Province/state</span>
                    <select required id="province"
                            value={addressObject?.province.id || 0}
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
                           onChange={e => dispatch(setAddressObject({
                               ...addressObject,
                               phoneNumber: e.target.value
                           }))}/>
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
                <button type="submit" onSubmit={handleSubmit}>
                    Continue to shipping
                </button>
            </div>
        </form>
    )
};

export default ShippingAddressForm;