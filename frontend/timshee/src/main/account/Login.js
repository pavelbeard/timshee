import Cookies from 'js-cookie';
import React from 'react';
import {useState} from "react";
import {Navigate, redirect, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuthStatus} from "../../redux/slices/checkAuthSlice";

import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const csrftoken = Cookies.get("csrftoken");
    const {isValid} = useSelector(state => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const submitLogin = async () => {
        try {
            const response = await fetch(API_URL + "api/stuff/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({email, password}),
                credentials: "include",
            })

            if (response.ok) {
                const json = await response.json();
                localStorage.setItem("token", json.token);
                dispatch(checkAuthStatus());
                navigate("/");
            } else {
                throw new Error(response.statusText);
            }
        } catch (e) {
            setErrorMessage("Error")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        await submitLogin();
    }

    if (isValid) {
        return (
            <Navigate to="/" />
        )
    }

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                {errorMessage &&
                    <label className="errorMessage login-labels">
                        <span className="label-text">{errorMessage}</span>
                    </label>}
                <label className="login-labels" htmlFor="email">
                    <span className="label-text">email:</span>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label className="login-labels" htmlFor="password">
                    <span className="label-text">password:</span>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <div className="login-button">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
};

export default Login;