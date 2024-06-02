import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../../redux/slices/menuSlice";
import "./Forms.css";

import "../../Main.css";
import crossBtn from "../../../media/static_images/cruz.svg";
import {
    createAddress,
    getAddressDetail,
    getCountries,
    getPhoneCodes,
    getProvinces, updateAddress
} from "./reducers/asyncThunks";
import {
    setError,
    setPhoneCode,
    setPhoneCodesFiltered,
    setProvince,
    setProvincesFiltered,
    editAddress as setAddressObject
} from "./reducers/addressFormSlice";
import AuthService from "../../api/authService";

const API_URL = process.env.REACT_APP_API_URL;

const EditAddressForm = () => {
    const dispatch = useDispatch();
    const {
        addressFormObject, countries, provinces,
        phoneCodes, isError, provincesFilteredList
    } = useSelector(state => state.addressForm);
    const isAuthenticated = AuthService.isAuthenticated();
    const token = AuthService.getCurrentUser();

    // FETCH COUNTRIES, PROVINCES AND MORE
    useEffect(() => {
        dispatch(getCountries());
        dispatch(getProvinces());
        dispatch(getPhoneCodes());
    }, []);

    // FETCH ADDRESS
    useEffect(() => {
        if (addressFormObject.id !== 0 && addressFormObject.id !== undefined) {
            dispatch(getAddressDetail({addressId: addressFormObject.id}));
        }
    }, []);

    useEffect(() => {
        if (addressFormObject.id === undefined &&
            countries.length > 0 &&
            provinces.length > 0 &&
            phoneCodes.length > 0
        ) {
            const filteredProvinces = provinces.filter(p =>
                p.country.id === countries[0].id
            );

            const filteredPhoneCodes = phoneCodes.filter(phoneCode =>
                phoneCode.country === countries[0].id
            )

            dispatch(setProvincesFiltered(filteredProvinces));
            dispatch(setPhoneCodesFiltered(filteredPhoneCodes));

            dispatch(setPhoneCode({
                phoneCode: filteredPhoneCodes[0].phone_code,
                country: filteredPhoneCodes[0].country
            }));
            dispatch(setProvince({
                id: filteredProvinces[0].id,
                name: filteredProvinces[0].name,
                country: filteredProvinces[0].country
            }))
        } else if (
            countries.length > 0 &&
            provinces.length > 0 &&
            phoneCodes.length > 0
        ) {
            const filteredProvinces = provinces.filter(p =>
                p.country.id === addressFormObject.province.country.id
            );

            const filteredPhoneCodes = phoneCodes.filter(phoneCode =>
                phoneCode.country === addressFormObject.phoneCode.country
            );

            dispatch(setProvincesFiltered(filteredProvinces));
            dispatch(setPhoneCodesFiltered(filteredPhoneCodes));

            // dispatch(setPhoneCode({
            //     phoneCode: filteredPhoneCodes[0].phone_code,
            //     country: filteredPhoneCodes[0].country
            // }));
            // dispatch(setProvince({
            //     id: filteredProvinces[0].id,
            //     name: filteredProvinces[0].name,
            //     country: filteredProvinces[0].country
            // }))
        }
    }, [countries]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            first_name: addressFormObject.firstName,
            last_name: addressFormObject.lastName,
            address1: addressFormObject.streetAddress,
            address2: addressFormObject.apartment,
            postal_code: addressFormObject.postalCode,
            province: addressFormObject.province.id,
            city: addressFormObject.city,
            phone_code: addressFormObject.phoneCode.country,
            phone_number: addressFormObject.phoneNumber,
            email: addressFormObject.email,
            as_primary: addressFormObject.asPrimary
        };

        if (addressFormObject.id !== undefined && addressFormObject.id !== 0)
        {
            dispatch(updateAddress({
                token,
                data,
                addressId: addressFormObject.id,
            }));
        } else {
            dispatch(createAddress({
                token,
                data,
            }));
        }

        dispatch(toggleAddressEditForm());
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
        dispatch(setPhoneCode({
            country: phoneCodesInternalTmp[0].country,
            phoneCode: phoneCodesInternalTmp[0].phone_code,
        }));
    };

    const changeProvince = (e) => {
        const province = provinces.filter(province =>
            province.id === parseInt(e.target.value)
        );

        dispatch(setProvince(province[0]));
    };

    const closeForm = (e) => {
        dispatch(toggleAddressEditForm());
    };


    return (
        <div className="overlay edit-address-form-container">
            <div style={{ zIndex: "-1", width: "100%", minHeight: "100vh"}} onClick={closeForm}></div>
            <form onSubmit={handleSubmit} className="edit-address-form">
                <span className="edit-address-form-title">EDIT ADDRESS</span>
                {isError && <div className="errorMessage">{isError}</div>}
                <div>
                    <label htmlFor="firstName">
                        <span className="label-text">firstname:</span>
                        <input
                            id="firstName"
                            type="text"
                            value={addressFormObject.firstName}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                firstName: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label htmlFor="lastName">
                        <span className="label-text">lastname:</span>
                        <input
                            id="lastName"
                            type="text"
                            value={addressFormObject.lastName}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                lastName: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label htmlFor="address1">
                        <span className="label-text">address 1:</span>
                        <input id="address1" type="text" value={addressFormObject.streetAddress}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                streetAddress: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label htmlFor="address2">
                        <span className="label-text">address 2:</span>
                        <input id="address2" type="text" value={addressFormObject.apartment}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                apartment: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label htmlFor="postcode">
                        <span className="label-text">postcode:</span>
                        <input
                            id="postcode"
                            type="text"
                            value={addressFormObject.postalCode}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                postalCode: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label htmlFor="city">
                        <span className="label-text">city:</span>
                        <input
                            id="city"
                            value={addressFormObject.city}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                city: e.target.value
                            }))}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="province">
                        <span className="label-text">province:</span>
                        <select id="province" value={addressFormObject.province.id}
                                onChange={changeProvince} required>
                            {provincesFilteredList?.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="country">
                        <span className="label-text">country:</span>
                        <select id="country" value={addressFormObject.province.country.id}
                                onChange={changeCountry} required>
                            {countries?.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="phoneCode">
                        <span className="label-text">PHONE CODE:</span>
                        <div id="phoneCode">{"± " + addressFormObject.phoneCode.phoneCode}</div>
                    </label>
                </div>
                <div>
                    <label htmlFor="phone">
                        <span className="label-text">phone:</span>
                        <input id="phone" type="text" value={addressFormObject.phoneNumber}
                               onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                phoneNumber: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label htmlFor="email">
                        <span className="label-text">email:</span>
                        <input id="email" type="email" value={addressFormObject.email}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                email: e.target.value
                            }))} required />
                    </label>
                </div>
                <div>
                    <label id="last-as-primary" htmlFor="asPrimary">
                        <input
                            id="asPrimary"
                            checked={addressFormObject.asPrimary}
                            onChange={e => dispatch(setAddressObject({
                                ...addressFormObject,
                                asPrimary: e.target.checked
                            }))}
                            type="checkbox"
                        />
                        <span className="label-text">as primary:</span>
                    </label>
                </div>
                <div>
                    <button onSubmit={handleSubmit}>submit</button>
                    <img src={crossBtn} onClick={closeForm} alt="alt-cross-btn" height={20}/>
                </div>
            </form>
        </div>
    )
};

export default EditAddressForm;