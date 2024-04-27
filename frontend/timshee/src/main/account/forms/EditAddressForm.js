import "../../Main.css";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../../redux/slices/menuSlice";
import {changeAddress} from "../../../redux/slices/editAddressSlice";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const EditAddressForm = () => {
    const dispatch = useDispatch();
    const csrftoken = Cookies.get("csrftoken");

    const {
        first_name, last_name, address1,
        address2, postal_code: postal_code, city,
        country, phone_number, email,
        address_id, as_primary
    } = useSelector(state => state.editAddress);

    const [errorMessage, setErrorMessage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [addressOne, setAddress1] = useState("");
    const [addressTwo, setAddress2] = useState("");
    const [postCode, setPostcode] = useState("");
    const [cityName, setCity] = useState("");
    const [countryName, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [emailField, setEmailField] = useState("");
    const [asPrimary, setAsPrimary] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_URL + `api/order/addresses/${address_id}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    address1: addressOne,
                    address2: addressTwo,
                    postal_code: postCode,
                    city: {
                        name: cityName,
                        country: countryName,
                    },
                    phone_number: phone,
                    email: emailField,
                    as_primary: asPrimary
                }),
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
        setCity(e.target.value);
    };
    const handleCountry = (e) => {
        e.preventDefault();
        setCountry(e.target.value);
    };
    const handlePhone = (e) => {
        e.preventDefault();
        setPhone(e.target.value);
    }
    const handleEmail = (e) => {
        e.preventDefault();
        setEmailField(e.target.value);
    }
    const handleAsPrimaryChange = async e => {
        const {value} = e.target;
        setAsPrimary(value);
    };

    const closeForm = () => {
        dispatch(toggleAddressEditForm());
        dispatch(changeAddress({
            first_name: '',
            last_name: '',
            address1: '',
            address2: '',
            postal_code: '',
            city: '',
            country: '',
            phone_number: '',
            email: '',
            as_primary: false,
            address_id: '',
        }))
    };

    useEffect(() => {
        setFirstName(first_name);
        setLastName(last_name);
        setAddress1(address1);
        setAddress2(address2);
        setPostcode(postal_code);
        setCity(city);
        setCountry(country);
        setPhone(phone_number);
        setEmailField(email);
        setAsPrimary(as_primary);
    }, []);

    return (
        <div className="overlay">
            <form onSubmit={handleSubmit}>
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
                            onChange={handleCity}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="country">
                        country
                        <input
                            id="country"
                            value={countryName}
                            onChange={handleCountry}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
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
                <div>
                    <label htmlFor="email">
                        phone
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
                            id="phone"
                            value={asPrimary}
                            onChange={handleAsPrimaryChange}
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