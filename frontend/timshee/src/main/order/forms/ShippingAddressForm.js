import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";

import backImg from "../../../media/static_images/back_to.svg"
import {
    getShippingAddress,
    resetOrderStates, setStep,
    updateOrderShippingAddress
} from "../../../redux/slices/shopSlices/orderSlice";
import {useDispatch, useSelector} from "react-redux";
import {checkAuthStatus, logout} from "../../../redux/slices/checkAuthSlice";

const ShippingAddressForm = ({ orderNumber, countries, phoneCodes, provinces }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isValid);
    const {addresses, steps} = useSelector((state) => state.order);
    const [shippingAddress, setShippingAddress] = React.useState("");
    const [shippingAddresses, setShippingAddresses] = React.useState([]);


    const [errorMessage, setErrorMessage] = React.useState("");

    const [country, setCountry] = React.useState();
    const [provincesInternal, setProvincesInternal] = React.useState([]);
    const [province, setProvince] = React.useState();

    const [phoneCodesInternal, setPhoneCodesInternal] = React.useState([]);
    const [phoneCode, setPhoneCode] = React.useState("");

    const [addressId, setAddressId] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [streetAddress, setStreetAddress] = React.useState("");
    const [apartment, setApartment] = React.useState("");
    const [postalCode, setPostalCode] = React.useState("");
    const [city, setCity] = React.useState("");
    const [phone, setPhone] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            "first_name": firstName,
            "last_name": lastName,
            "city": city,
            "address1": streetAddress,
            "address2": apartment,
            "postal_code": postalCode,
            "phone_number": phone,
            "email": email,
            "additional_data": "",
            "province": province,
            "phone_code": phoneCode
        }

        if (isAuthenticated) {
            data["user"] = localStorage.getItem("userId");
            data["as_primary"] = true;
        }

        const orderId = JSON.parse(localStorage.getItem("order"))["id"];
        dispatch(updateOrderShippingAddress(
            {orderId, shippingAddress: data, shippingAddressId: addressId, isAuthenticated: isAuthenticated}));
        dispatch(setStep(steps[1]));
        navigate(`/shop/${orderNumber}/checkout/${steps[1].step}`);
    };

    const changeCountry = (e) => {
        setCountry(e.target.value);

        const provincesInternalTmp = provinces.filter(province =>
            province.country.id === parseInt(e.target.value)
        );

        const phoneCodesInternalTmp = phoneCodes.filter(phoneCode =>
            phoneCode.country === parseInt(e.target.value)
        );

        setPhoneCodesInternal(phoneCodesInternalTmp);
        setPhoneCode(phoneCodesInternalTmp[0]['country'])

        setProvincesInternal(provincesInternalTmp);
        setProvince(provincesInternalTmp[0].id);
    };

    const changeAddress = (e) => {
        try {
            const address = shippingAddresses.filter(address =>
                address.id === parseInt(e.target.value)
            ).at(0);
            setShippingAddress(address.id);

            setAddressId(address.id)
            setFirstName(address.first_name);
            setLastName(address.last_name);
            setCity(address.city);
            setStreetAddress(address.address1);
            setApartment(address.address2);
            setPostalCode(address.postal_code);
            setPhone(address.phone_number);
            setPhoneCode(address.phone_code.country);

            setProvince(address.province.id);
            setCountry(address.province.country.id);
            setEmail(address.email);
        } catch (e) {
            //
        }
    };

    useEffect(() => {
        if (addresses.length > 0) {
            setShippingAddresses(addresses);
        }
    }, [addresses]);

    useEffect(() => {
        dispatch(getShippingAddress({isAuthenticated}));
        dispatch(checkAuthStatus());
    }, [])

    useEffect(() => {
        if (countries.length > 0  && phoneCodes.length > 0 && provinces.length > 0) {
            setCountry(countries[0].name);

            const provincesTmp = provinces.filter(province =>
                province.country.name === countries[0].name
            );

            const phoneCodesTmp = phoneCodes.filter(phoneCode =>
                phoneCode.country === countries[0].id
            );

            setPhoneCodesInternal(phoneCodesTmp);
            setPhoneCode(phoneCodesTmp[0].country);

            setProvincesInternal(provincesTmp);
            setProvince(provincesTmp[0].id);
        }
    }, [countries, phoneCodes, provinces]);

    return(
        <form onSubmit={handleSubmit} className="shipping-address-form">
            {errorMessage && <div className="shipping-address-form-error-essage">{errorMessage}</div>}
            <span className="checkout-contact">
                <h3>Contact</h3>
            </span>
            {
                isAuthenticated ? (
                    <div className="shipping-address-user">
                        <span>{localStorage.getItem("userName")}</span>
                        <span onClick={() => dispatch(logout())}>Logout</span>
                    </div>
                ) : (

                    <div className="shipping-addeess-email">
                        <label htmlFor="email">
                            <span className="shipping-address-form-text">Email:</span>
                            <input required id="email" type="email" value={email}
                                   onChange={e => setEmail(e.target.value)}/>
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
                    <option key={address.id}
                            value={address.id}>
                        {`${address.address1}, ${address.address2}, ${address.postal_code}, ${address.province.name}, ${
                            address.city
                        }, ${address.province.country.name}, ${address.first_name} ${address.last_name}`}
                    </option>
                ))}
            </select>
            <div className="shipping-address-country">
                <label htmlFor="country">
                    <span className="shipping-address-form-text">Country/region</span>
                    <select required size="1" id="country" value={country?.name} aria-placeholder="Country/region"
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
                    <input required id="firstName" type="text" value={firstName}
                           onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label htmlFor="lastName">
                    <span className="shipping-address-form-text">Last name</span>
                    <input required id="lastName" type="text" value={lastName}
                           onChange={e => setLastName(e.target.value)}/>
                </label>
            </div>
            <div className="shipping-address-address">
                <label htmlFor="streetAddress">
                    <span className="shipping-address-form-text">Street and house number</span>
                    <input required id="streetAddress" type="text" value={streetAddress}
                           onChange={e => setStreetAddress(e.target.value)}/>
                </label>
            </div>
            <div className="shipping-address-apartment">
                <label htmlFor="apartment">
                    <span className="shipping-address-form-text">Apartment (optional)</span>
                    <input id="apartment" type="text" value={apartment}
                           onChange={e => setApartment(e.target.value)}/>
                </label>
            </div>
            <div className="shipping-address-location">
                <label htmlFor="postalCode">
                    <span className="shipping-address-form-text">Postal Code</span>
                    <input required id="postalCode" type="text" value={postalCode}
                           onChange={e => setPostalCode(e.target.value)}/>
                </label>
                <label htmlFor="city">
                    <span className="shipping-address-form-text">City</span>
                    <input required id="city" type="text" value={city}
                           onChange={e => setCity(e.target.value)}/>
                </label>
                <label htmlFor="province">
                    <span className="shipping-address-form-text">Province/state</span>
                    <select required id="province" value={province}
                            onChange={e => setProvince(e.target.value)}>
                        {provincesInternal.map((province) => (
                            <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="shipping-address-phone">
                <label htmlFor="phone">
                    <span className="shipping-address-form-text">Phone:</span>
                    <input required id="phone" type="text" value={phone}
                           onChange={e => setPhone(e.target.value)}/>
                </label>
            </div>
            <div className="form-submit">
                <div>
                    <img src={backImg} alt="alt-back-to-cart" height={14}/>
                    <Link to="/cart" onClick={() => dispatch(
                        resetOrderStates()
                    )}>Return to cart</Link>
                </div>
                <button type="submit" onSubmit={handleSubmit}>
                    Continue to shipping
                </button>
            </div>
        </form>
    )
};

export default ShippingAddressForm;