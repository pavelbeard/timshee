import React, {useContext} from 'react';
import {useState} from "react";
import { useNavigate } from "react-router-dom";

import t from "../../../../translate/TranslateService";
import {useAuthProvider, useErrorStore} from "../../../../../store";
import {clsx} from "clsx";
import CustomInput from "../../../../../components/custom-input";
import {Button} from "../../../../../components/button";
import CustomTitle from "../../../../../components/custom-title";
import {useTranslation} from "react-i18next";


const Signin = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { signIn } = useAuthProvider();
    const { error, setError } = useErrorStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn(email, password);

        if (!(result instanceof Error)) {
            navigate(`/`);
        } else {
            setError({ message: result.message });
        }
    }

    return (
        <div className={clsx('flex lg:items-center justify-between')}>
            <div></div>
            <form className="flex flex-col md:w-4/12 lg:w-4/12 pb-6" onSubmit={handleSubmit}>
                <CustomTitle title={t('stuff.forms:signInTitle')} />
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
                <div className="flex flex-col">
                    <Button type="submit" className="pb-3 h-6">
                        {t('stuff.forms:login')}
                    </Button>
                    <Button className="h-6" onClick={() => navigate("/account/password/reset/send-email")}>
                        {t('stuff.forms:forgotPassword')}
                    </Button>
                </div>
                {error && (<div className="text-red-500">{error}</div>)}
            </form>
            <div></div>
        </div>
    )
};

export default Signin;