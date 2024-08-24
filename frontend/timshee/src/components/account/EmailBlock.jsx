import {clsx} from "clsx";
import React, {useState} from "react";
import {useSignOut} from "../../lib/hooks";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {toggleChangeEmail} from "../../redux/features/store/uiControlsSlice";
import {useDispatch} from "react-redux";

export default function EmailBlock({ user, userError}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { signout } = useSignOut();
    const { t } = useTranslation();
    const [logoutError, setLogoutError] = useState(null);

    const signOut = async () => {
        try {
            await signout();
            navigate(from, { replace: true });
        } catch (error) {
            setLogoutError(error.message)
        }
    }

    return (
        <div>
            {userError?.message || logoutError && <section>{userError.message || logoutError}</section>}
            <section className="flex max-sm:flex-col max-sm:items-center lg:flex-row pb-4" data-first-block="">
                <span
                    className="tracking-widest flex items-center justify-start max-sm:justify-center w-16 h-8 text-center max-sm:mr-0 mr-2">
                    {t('account:account')}
                </span>
                <span className={clsx(
                        'tracking-widest',
                        'flex items-center justify-center w-48 h-8 text-center border-black border-[1px] cursor-pointer',
                        'hover:bg-black hover:text-white'
                    )} onClick={() => dispatch(toggleChangeEmail())}
                >
                    {user}
                </span>
                <button
                    className="underlined-button-set tracking-widest flex items-center justify-end max-sm:justify-center w-28 h-8 text-center ml-2 max-sm:ml-0"
                    onClick={signOut}>
                {t('account:logout')}
                </button>
            </section>
        </div>
    )
}