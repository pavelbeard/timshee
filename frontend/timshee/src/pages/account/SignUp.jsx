import React, {useEffect} from "react";
import {useState} from "react";

import {useNavigate} from "react-router-dom";

import CustomInput from "../../components/ui/forms/CustomInput";
import Button from "../../components/ui/Button";
import {clsx} from "clsx";
import {useAuthProvider, useErrorStore} from "../../store";
import CustomTitle from "../../components/ui/forms/CustomTitle";
import {useTranslation} from "react-i18next";
import {useInput} from "../../lib/hooks";
import {signUp} from "../../lib/auth";

const SignUp = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, reset, formAttrs] = useInput('formData', {
        "first_name": "",
        "last_name": "",
        email: "",
    })
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        setError(null);
        setPasswordError(null);
    }, [password, confirmPassword, formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords aren't matching!");
            return;
        }

        const result = await signUp({...formData, password, password2: confirmPassword });
        if (!(result instanceof Error)) {
            reset();
            navigate(`/account/signin`);
        } else {
            setError(result.message)
        }
    };


    return (
        <div className={clsx('flex lg:items-center justify-between',)}>
            <div></div>
            <form className="flex flex-col md:w-4/12 lg:w-4/12 pb-6" onSubmit={handleSubmit}>
                <CustomTitle title={t('stuff.forms:signUpTitle')} />
                <CustomInput
                    htmlFor="first_name"
                    type="text"
                    labelText={t('stuff.forms:firstname')}
                    {...formAttrs('first_name')}
                    required={true}
                />
                <CustomInput
                    htmlFor="last_name"
                    type="text"
                    labelText={t('stuff.forms:lastname')}
                    {...formAttrs('last_name')}
                    required={true}
                />
                <CustomInput
                    htmlFor="username"
                    type="email"
                    labelText="email:"
                    {...formAttrs('username')}
                    required={true}
                />
                <CustomInput
                    htmlFor="password"
                    type="password"
                    labelText={t('stuff.forms:password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required={true}
                />
                <CustomInput
                    htmlFor="password2"
                    type="password"
                    labelText={t('stuff.forms:passwordConfirm')}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required={true}
                />
                <Button type="submit">{t('stuff.forms:register')}</Button>
                {(error || passwordError) && (<div className="text-red-500">{error || passwordError}</div>)}
            </form>
            <div></div>
        </div>
    )
};

export default SignUp;