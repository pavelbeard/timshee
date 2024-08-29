import CustomTitle from "../../ui/forms/CustomTitle";
import CustomInput from "../../ui/forms/CustomInput";
import Button from "../../ui/Button";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export default function SignInForm({ submit, ...rest }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <form className="flex flex-col md:w-4/12 lg:w-4/12 pb-6" onSubmit={submit}>
            <CustomTitle title={t('stuff.forms:signInTitle')}/>
            <CustomInput
                htmlFor="email"
                name="email"
                type="email"
                labelText="email:"
                value={rest?.username}
                onChange={(e) => rest?.setUsername(e.target.value)}
                required={true}
            />
            <CustomInput
                htmlFor="password"
                name="password"
                type="password"
                labelText={t('stuff.forms:password')}
                value={rest?.password}
                onChange={e => rest.setPassword(e.target.value)}
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
            {rest?.error && (<div className="text-red-500">{rest?.error}</div>)}
        </form>
    );
}