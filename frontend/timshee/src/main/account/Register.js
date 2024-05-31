import React, {useContext} from "react";
import {useState} from "react";

import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

import "./Register.css";
import AuthContext from "../auth/AuthProvider";


const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {register} = useContext(AuthContext);

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

        const result = await register({firstName, lastName, email, password, setErrorMessage});

        if (result) {
            navigate("/");
        }
    };


    return (
        <div className="register-form-container">
            {errorMessage &&
                <label  className="errorMessage register-labels">
                    <span className="label-text">{errorMessage}</span>
                </label>}
            <form className="register-form" onSubmit={handleSubmit}>
                <label className="register-labels" htmlFor="firstName">
                    <span className="label-text">firstname:</span>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                </label>
                <label className="register-labels" htmlFor="lastName">
                    <span className="label-text">last name:</span>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                </label>
                <label className="register-labels" htmlFor="email">
                    <span className="label-text">email:</span>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label className="register-labels" htmlFor="password">
                    <span className="label-text">password:</span>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label className="register-labels" htmlFor="confirmPassword">
                    <span className="label-text">confirm password:</span>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <div className="register-button">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
};

export default Register;