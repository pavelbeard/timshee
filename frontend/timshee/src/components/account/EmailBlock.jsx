import {clsx} from "clsx";
import React, {useState} from "react";
import {useAccountContext, useAuthContext, useSignOut} from "../../lib/hooks";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function EmailBlock() {
    const { emailError, toggleChangeEmail, email } = useAccountContext();
    const signOut = useSignOut();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [logoutError, setLogoutError] = useState();

    const signout = async () => {
        try {
            await signOut();
            navigate(from, { replace: true });
        } catch (error) {
            setLogoutError(error.message)
        }
    }

    return (
        <div className="flex max-sm:flex-col max-sm:items-center lg:flex-row pb-4" data-first-block="">
            <span
                className="tracking-widest flex items-center justify-start max-sm:justify-center w-16 h-8 text-center max-sm:mr-0 mr-2">
                {t('account:account')}
            </span>
            <span className={clsx(
                'tracking-widest',
                'flex items-center justify-center w-48 h-8 text-center border-black border-[1px] cursor-pointer',
                'hover:bg-black hover:text-white'
            )} onClick={toggleChangeEmail}>
                {emailError ? emailError.message : email}
            </span>
            <span
                className="tracking-widest flex items-center justify-end max-sm:justify-center w-28 h-8 text-center ml-2 max-sm:ml-0"
                onClick={signout}>
                {t('account:logout')}
            </span>
        </div>
    )
}