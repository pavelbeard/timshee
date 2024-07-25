import React from "react";
import {useState} from "react";

import {useNavigate} from "react-router-dom";

import CustomInput from "../../../../../components/custom-input";
import {Button} from "../../../../../components/button";
import {clsx} from "clsx";
import {useAuthProvider, useErrorStore} from "../../../../../store";
import CustomTitle from "../../../../../components/custom-title";
import {useTranslation} from "react-i18next";

const Signup = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { signUp } = useAuthProvider();
    const { error, setError } = useErrorStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError({ message: "Passwords aren't matching!"});
            setTimeout(() => setError({ message: null}), 2000);
            return;
        }

        const result = await signUp(
            firstName, lastName, email, password, confirmPassword
        );

        if (typeof result === 'undefined') {
            navigate(`/account/signin`);
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
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required={true}
                />
                <CustomInput
                    htmlFor="last_name"
                    type="text"
                    labelText={t('stuff.forms:lastname')}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required={true}
                />
                <CustomInput
                    htmlFor="email"
                    type="email"
                    labelText="email:"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                {error && (<div className="text-red-500">{error}</div>)}
            </form>
            <div></div>
        </div>
    )
};

export default Signup;