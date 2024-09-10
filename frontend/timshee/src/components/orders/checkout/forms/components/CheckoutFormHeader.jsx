import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCheckoutFormContext, useSignIn, useSignOut} from "../../../../../lib/hooks";
import {XMarkIcon} from "@heroicons/react/24/outline";
import CustomInput from "../../../../ui/forms/CustomInput";
import {
    selectIsSignInAtCheckoutChecked,
    toggleSignInAtCheckoutCheckbox
} from "../../../../../redux/features/store/uiControlsSlice";
import CustomTitle from "../../../../ui/forms/CustomTitle";
import {clsx} from "clsx";
import {selectCurrentUser} from "../../../../../redux/features/store/authSlice";

export default function CheckoutFormHeader({ ...rest }) {
    const { token } = useCheckoutFormContext();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [signIn, isSuccess] = useSignIn();
    const {signout} = useSignOut();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const user = useSelector(selectCurrentUser);
    const [username, setUsername] = useState(user || rest?.user || '');
    const showSignin = useSelector(selectIsSignInAtCheckoutChecked);

    const handleSubmit = e => {
        e.preventDefault();
        signIn(username, password, setError);
        if (isSuccess) {
            setUsername('');
            setPassword('');
            dispatch(toggleSignInAtCheckoutCheckbox(false))
        }
    };

    useEffect(() => setError(null), [username, password])

    if (token) {
        return (
            <section className="checkout-form-header">
                <div>{user}</div>
                {/*<button*/}
                {/*    type="button"*/}
                {/*    onClick={signout}*/}
                {/*    className="underlined-button-set">*/}
                {/*    {t('account:logout')}*/}
                {/*</button>*/}
            </section>
    )
        ;
    } else {
        return (
            <section className={clsx('p-2 border-[1px] border-gray-200')}>
                <div data-signin-signout-form="">
                    {showSignin
                        ? <form onSubmit={handleSubmit}>
                            <CustomTitle title={t('stuff.forms:rapidSignin')} />
                        <CustomInput
                            htmlFor="email"
                            name="email"
                            type="email"
                            labelText="email:"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required={true}
                        />
                        <CustomInput
                            htmlFor="password"
                            name="password"
                            type="password"
                            labelText={t('stuff.forms:password')}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required={true}
                        />
                        <div className="flex justify-between">
                            <button type="submit" className="underlined-button">
                                {t('stuff.forms:login')}
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch(toggleSignInAtCheckoutCheckbox())}
                                className="underlined-button-set"
                            >
                                <XMarkIcon strokeWidth="0.5" className="size-4"/>
                            </button>
                        </div>
                        {error && <div className="text-red-500">{error}</div>}
                    </form>
                    : <div className="flex flex-col items-start">
                        <button
                            type="button"
                            onClick={() => dispatch(toggleSignInAtCheckoutCheckbox())}
                            className="underlined-button-set roboto-text-medium-xs"
                        >
                            {t('stuff.forms:rapidSignin')}
                        </button>
                        <span className="roboto-text-xs">{t('stuff.forms:or')}</span>
                        <Link to={'/account/signup'} className="underlined-button-set roboto-text-medium-xs">
                            {t('stuff.forms:signUpPromote')}
                        </Link>
                    </div>}
                </div>
            </section>
        )
    }
}