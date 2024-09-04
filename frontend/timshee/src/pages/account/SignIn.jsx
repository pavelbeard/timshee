import React, { useEffect } from 'react';
import { useState } from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import { clsx } from "clsx";
import CustomInput from "../../components/ui/forms/CustomInput";
import CustomTitle from "../../components/ui/forms/CustomTitle";
import { useTranslation } from "react-i18next";
import {useAuthContext, useInput, useSignIn} from "../../lib/hooks";
import Button from "../../components/ui/Button";
import {useSignInMutation} from "../../redux/features/api/authApiSlice";
import {setCredentials, setToken} from "../../redux/features/store/authSlice";
import {useDispatch} from "react-redux";
import Loading from "../Loading";
import SignFormContainer from "../../components/account/SignFormContainer";
import SignInForm from "../../components/account/forms/SignInForm";


const SignIn = () => {
    const [signIn, isLoading, isSuccess] = useSignIn();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(username, password, setError, true);
    };

    useEffect(() => {
        setError(null);
    }, [username, password]);

    return (
        <SignFormContainer>
            {isLoading
                ? <Loading/>
                : <SignInForm
                    submit={handleSubmit}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    error={error}
                />
            }
        </SignFormContainer>
    )
};

export default SignIn;