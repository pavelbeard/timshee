import React, { useEffect } from 'react';
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import CustomInput from "../../components/ui/forms/CustomInput";
import CustomTitle from "../../components/ui/forms/CustomTitle";
import { useTranslation } from "react-i18next";
import {useAuthContext, useInput} from "../../lib/hooks";
import { signIn } from "../../lib/auth";
import Button from "../../components/ui/Button";


const SignIn = () => {
    const { t } = useTranslation();
    const { setToken } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/ ";
    const [email, reset, emailAttrs] = useInput('email', '');
    const [password, setPassword] = useState();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn({email, password});
        if (result?.access) {
            reset();
            setToken({ access: result.access });
            navigate(from, { replace: true }) ;
        } else if (result instanceof Error) {
            setError(result.message);
        }
    }

    return (
        <div className={clsx('flex lg:items-center justify-between')}>
            <div></div>
            <form className="flex flex-col md:w-4/12 lg:w-4/12 pb-6" onSubmit={handleSubmit}>
                <CustomTitle title={t('stuff.forms:signInTitle')} />
                <CustomInput
                    htmlFor="email"
                    name="email"
                    type="email"
                    labelText="email:"
                    {...emailAttrs()}
                    required={true}
                />
                <CustomInput
                    htmlFor="password"
                    name="password"
                    type="password"
                    labelText={t('stuff.forms:password')}
                    {...emailAttrs('password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required={true}
                />
                <div className="flex flex-col">
                    <Button type="submit" className="pb-3 h-6">
                        {t('stuff.forms:login')}
                    </Button>
                    <Button className="h-6" onClick={() => navigate("/account/password/reset/request")}>
                        {t('stuff.forms:forgotPassword')}
                    </Button>
                </div>
                {error && (<div className="text-red-500">{error}</div>)}
            </form>
            <div></div>
        </div>
    )
};

export default SignIn;