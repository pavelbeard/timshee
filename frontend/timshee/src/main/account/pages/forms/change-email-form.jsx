import React, {useEffect} from "react";
import AuthService from "../../../api/authService";

import t from "../../../translate/TranslateService";
import {clsx} from "clsx";
import CustomInput from "../../../../components/custom-input";
import {Button} from "../../../../components/button";
import {useEmailStore, useErrorStore} from "../../../../store";
import ConfirmEmail from "../../../../emails/confirm-email";
import CustomTitle from "../../../../components/custom-title";
import {XMarkIcon} from "@heroicons/react/16/solid";

const formContainer = clsx(
    'max-sm:w-10/12',
    'md:w-3/5',
    'lg:w-2/5',
);

const ChangeEmailForm = () => {
    const token = AuthService.getAccessToken();
    const language = t.language();
    const { error, email, isEmailConfirmed, isEmailExists,
        setEmail, getEmail, sendEmail, changeEmail, toggleChangeEmail
    } = useEmailStore();


    useEffect(() => {
        async function f() {
            await getEmail(token);
        }

        f();
    }, []);


    const handleSubmit = async e => {
        e.preventDefault();
        await sendEmail(
            token,
            email,
            'Timshee | Смена email:',
            <ConfirmEmail email={email} />
        );

        // if (!error) {
        //     await changeEmail(token, email);
        // }

    };

    return (
        <div className="flex flex-col items-center justify-center pb-6">
            <CustomTitle title={'Сменить email'} />
            <form onSubmit={handleSubmit} className={clsx('flex flex-col', formContainer)}>
                <CustomInput
                    htmlFor="email"
                    labelText={t.forms.newEmail[language]}
                    required={true}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <div className="flex items-center justify-between">
                    <div className="w-1/2">
                        <Button className="h-6">{t.forms.submit[language]}</Button>
                    </div>
                    <XMarkIcon
                        onClick={toggleChangeEmail}
                        className={clsx(
                            "w-6 h-6 border-black border-[1px] mt-2",
                            'hover:bg-black hover:text-white cursor-pointer',
                        )}
                    />
                </div>
                {error && (<div className="text-red-500">{error}</div>)}
            </form>
        </div>
    )
};

export default ChangeEmailForm;