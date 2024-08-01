import React, {useEffect} from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import "./Login.css";
import translateService from "../../../../translate/TranslateService";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../../../redux/services/features/auth/authSlice";
import { useSignInMutation } from "../../../../../redux/services/features/auth/authApiSlice";
import Loading from "../../../../techPages/Loading";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = translateService.language();
    const [signIn, { isLoading }] = useSignInMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const userData = await signIn({ username: email, password: password }).unwrap();
            dispatch(setCredentials({ user: email, token: userData.access }));
            navigate('/');
            setEmail('');
            setPassword('');
        } catch (e) {
            if (!e?.status) {
                setErrorMessage('Сервер не отвечает.')
            } else if (e?.status === 400) {
                setErrorMessage('Неправильные данные. Введите еще раз.')
            } else if (e?.status === 401) {
                setErrorMessage('Неавторизован.')
            } else {
                setErrorMessage('Ошибка входа в аккаунт.')
            }
        }
    };

    useEffect(() => {
        setErrorMessage("");
    }, [email, password])

    if (isLoading) {
        return <Loading />
    } else {
        return (
            <section className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    {errorMessage &&
                        <label className="errorMessage login-labels">
                            <span className="label-text">{errorMessage}</span>
                        </label>}
                    <label className="login-labels" htmlFor="email">
                        <span className="label-text">email:</span>
                        <input style={{paddingLeft: "1rem"}}
                               id="email"
                               type="email"
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               required
                        />
                    </label>
                    <label className="login-labels" htmlFor="password">
                        <span className="label-text">{translateService.authForms.password[language]}</span>
                        <input style={{paddingLeft: "1rem"}}
                               id="password"
                               type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               required
                        />
                    </label>
                    <div className="button-set">
                        <div className="button-item">
                            <button type="submit">{translateService.authForms.login[language]}</button>
                        </div>
                        <div className="button-item">
                            <button onClick={() => navigate("/account/password/reset/send-email")}>
                                {translateService.authForms.forgotPassword[language]}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        )
    }
};

export default Login;