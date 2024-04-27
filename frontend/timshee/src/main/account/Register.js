import React from "react";
import {useState} from "react";

import "./Register.css";
import Cookies from "js-cookie";
import {checkAuthStatus} from "../../redux/slices/checkAuthSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const csrftoken = Cookies.get("csrftoken");

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords aren't matching!");
            setTimeout(() => setErrorMessage(''), 2000);
            return;
        }

        try {
            const response = await fetch(API_URL + "api/stuff/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
                credentials: "include",
            })

            if (response.ok) {
                const json = await response.json();
                localStorage.setItem("token", json.token);
                dispatch(checkAuthStatus());
                navigate("/account/details")
            }

        } catch (error) {
            setErrorMessage("Server's error...");
            setTimeout(() => setErrorMessage(''), 2000);
        }
    };


    return (
        <div className="register">
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">firstname:
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="lastName">last name:
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="email">email:
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="password">password:
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="confirmPassword">confirm password:
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
};

export default Register;