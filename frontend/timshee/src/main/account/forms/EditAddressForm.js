import "../../Main.css";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../../redux/slices/menuSlice";
import {changeAddress} from "../../../redux/slices/editAddressSlice";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const EditAddressForm = () => {
    const dispatch = useDispatch();
    const csrftoken = Cookies.get("csrftoken");
    //DANGEROUS!!!! BUT NECESSARY!
    const nameInputRef = useRef();

    const {
        first_name, last_name, address1,
        address2, postal_code, province_obj,
        city, phone_code_obj, phone_number,
        email, address_id, as_primary
    } = useSelector(state => state.editAddress);

    const [errorMessage, setErrorMessage] = useState("");
    const [firstName, setFirstName] = useState(first_name);
    const [lastName, setLastName] = useState(last_name);
    const [addressOne, setAddress1] = useState(address1);
    const [addressTwo, setAddress2] = useState(address2);
    const [provinceId, setProvinceId] = useState(province_obj.id);
    const [countryId, setCountryId] = useState(province_obj.country.id);
    const [cityName, setCityName] = useState(city);
    const [postCode, setPostcode] = useState(postal_code);
    const [phoneCode, setPhoneCode] = useState(phone_code_obj);
    const [phone, setPhone] = useState(phone_number);
    const [emailField, setEmailField] = useState(email);
    const [asPrimary, setAsPrimary] = useState(as_primary);

    const [provinceObj, setProvinceObj] = useState(province_obj);

    const [countryName, setCountryName] = useState(provinceObj.country.name);
    const [provinceName, setProvinceName] = useState(provinceObj.name);

    const [countriesList, setCountriesList] = useState([]);
    const [provincesList, setProvincesList] = useState([]);

    const getCountries = async () => {
        const countriesResponse = await fetch(API_URL + "api/order/countries/", {
            credentials: "include",
        });
        const countries = await countriesResponse.json();
        setCountriesList(countries);
    };

    const getCities = async () => {
        try {
            const response = await fetch(API_URL + `api/order/provinces/?country__id=${countryId}`, {
                credentials: "include",
            });
            const json = await response.json();
            setProvincesList(json);
        } catch (e) {
            setErrorMessage("HAS HAPPENED A BAD THING...");
        }
    };

    const getPhoneCode = async () => {
        try {
            const response = await fetch(API_URL + `api/order/phone-codes/?country__id=${countryId}`, {
                credentials: "include",
            });
            const json = await response.json();
            setPhoneCode(json[0]);
        } catch (e) {
            setErrorMessage("HAS HAPPENED A BAD THING...");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                first_name: firstName,
                last_name: lastName,
                address1: addressOne,
                address2: addressTwo,
                postal_code: postCode,
                province: provinceId,
                city: cityName,
                phone_code: phoneCode.country,
                phone_number: phone,
                email: emailField,
                as_primary: asPrimary
            };
            const response = await fetch(API_URL + `api/order/addresses/${address_id}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (response.ok) {
                closeForm();
            } else {
                throw new Error(response.statusText);
            }
        } catch (e) {
            setErrorMessage("Something went wrong: " + e.message);
        }
    };

    const handleFirstName = (e) => {
        e.preventDefault();
        setFirstName(e.target.value);
    };
    const handleLastName = (e) => {
        e.preventDefault();
        setLastName(e.target.value);
    };
    const handleAddress1 = (e) => {
        e.preventDefault();
        setAddress1(e.target.value);
    };
    const handleAddress2 = (e) => {
        e.preventDefault();
        setAddress2(e.target.value);
    };
    const handlePostCode = (e) => {
        e.preventDefault();
        setPostcode(e.target.value);
    };
    const handleCity = (e) => {
        e.preventDefault();
        setProvinceName(e.target.value);
    };
    const handleCountry = (e) => {
        e.preventDefault();
        setCountryName(e.target.value);
    };
    const handlePhone = (e) => {
        e.preventDefault();
        setPhone(e.target.value);
    }
    const handleEmail = (e) => {
        e.preventDefault();
        setEmailField(e.target.value);
    }
    // const handleAsPrimaryChange = async (e) => {
    //     e.preventDefault();
    //     setAsPrimary(e.target.value);
    // };
    const handleCountryIdChange = async e => {
        e.preventDefault();
        const dataCountryOption = e.target.options[e.target.selectedIndex];
        setCountryId(dataCountryOption.getAttribute('data-country-id'));
        setCountryName(dataCountryOption.value);
        setProvinceName("");
        setProvinceId("");
        setCityName("");
    };

    const handleProvinceChange = (e) => {
        e.preventDefault();
        const dataProvince = e.target.options[e.target.selectedIndex];
        setProvinceId(dataProvince.getAttribute('data-city-id'));
        setProvinceName(dataProvince.value);
    };

    const handleCityChange = (e) => {
        e.preventDefault();
        setCityName(e.target.checked);
    };

    const closeForm = () => {
        dispatch(toggleAddressEditForm());
        dispatch(changeAddress({
            first_name: '',
            last_name: '',
            address1: '',
            address2: '',
            postal_code: '',
            province_obj: {},
            phone_code_obj: '',
            phone_number: '',
            email: '',
            as_primary: false,
            address_id: '',
        }))
    };

    useEffect(() => {
        getCountries();
        getCities();
        getPhoneCode();
    }, [countryId, provinceId, provinceName]);

    return (
        <div className="overlay">
            <form onSubmit={handleSubmit} style={{ background: '#fff' }}>
                {errorMessage && <div className="errorMessage">{errorMessage}</div>}
                <div>
                    <label htmlFor="firstName">
                        firstname:
                        <input
                            id="firstName"
                            onChange={handleFirstName}
                            value={firstName}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="lastName">
                        lastname:
                        <input
                            id="lastName"
                            value={lastName}
                            onChange={handleLastName}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="address1">
                        address 1:
                        <input
                            id="address1"
                            value={addressOne}
                            onChange={handleAddress1}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="address2">
                        address 2:
                        <input
                            id="address2"
                            value={addressTwo}
                            onChange={handleAddress2}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="postcode">
                        postcode
                        <input
                            id="postcode"
                            value={postCode}
                            onChange={handlePostCode}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="city">
                        city
                        <input
                            id="city"
                            value={cityName}
                            onChange={handleCityChange}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="province">
                        province
                        <select
                            id="province"
                            ref={nameInputRef}
                            value={provinceName}
                            onChange={handleProvinceChange}
                            required
                        >
                            <option value="">---</option>
                            {provincesList?.map((province) => (
                                <option
                                    key={province.id}
                                    data-province-id={province.id}
                                    value={province.name}
                                >
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="country">
                        country
                        <select id="country" value={countryName} onChange={handleCountryIdChange} required>
                            {countriesList?.map((country) => (
                                <option key={country.id} data-country-id={country.id} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <div>
                        <div id="phoneCode">{ "" || phoneCode.phone_code}</div>
                        <label htmlFor="phone">
                            phone
                            <input
                                id="phone"
                                value={phone}
                                onChange={handlePhone}
                                type="text"
                                required
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <label htmlFor="email">
                        email
                        <input
                            id="email"
                            value={emailField}
                            onChange={handleEmail}
                            type="email"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="asPrimary">
                        as primary
                        <input
                            id="asPrimary"
                            checked={asPrimary}
                            // onChange={handleAsPrimaryChange}
                            onChange={e => setAsPrimary(e.target.checked)}
                            type="checkbox"
                        />
                    </label>
                </div>
                <button onSubmit={handleSubmit}>submit</button>
                <div onClick={closeForm} style={{ cursor: "grab" }}>X</div>
            </form>
        </div>
    )
};

export default EditAddressForm;