import Cookies from 'js-cookie';
import React, {useContext} from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import "./Login.css";
import AuthContext from "../auth/AuthProvider";


const Login = () => {
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const result = await login({email, password, setErrorMessage});

        if (result) {
            navigate("/");
        }
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