import React, {useEffect} from "react";

import {clsx} from "clsx";
import CustomInput from "../../ui/forms/CustomInput";
import Button from "../../ui/Button";
import ConfirmEmail from "../../../emails/confirm-email";
import CustomTitle from "../../ui/forms/CustomTitle";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {useTranslation} from "react-i18next";
import {useAccountContext, useMailsSenderContext} from "../../../lib/hooks";


const ChangeEmailForm = () => {
    const { t } = useTranslation();
    const { email, setEmail, toggleChangeEmail } = useAccountContext();
    const { sendEmail } = useMailsSenderContext();

    const formContainer = clsx(
        'max-sm:w-10/12',
        'md:w-3/5',
        'lg:w-2/5',
    );

    const handleSubmit = async e => {
        e.preventDefault();

        await sendEmail.mutate(
            email,
            `Timshee | ${t('account.forms:changeEmail')}:`,
            <ConfirmEmail email={email} />
        );


    };

    useEffect(() => {
        if (sendEmail.isSuccess) {
            sendEmail.reset()
        }
    }, [sendEmail])

    return (
        <div className="flex flex-col items-center justify-center pb-6">
            <CustomTitle title={'Сменить email'} />
            <form onSubmit={handleSubmit} className={clsx('flex flex-col', formContainer)}>
                <CustomInput
                    htmlFor="email"
                    labelText={t('forms:newEmail')}
                    required={true}
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        sendEmail.reset();
                    }}
                />
                <div className="flex items-center justify-between">
                    <div className="w-1/2">
                        <Button className="h-6">{t('forms:submit')}</Button>
                    </div>
                    <XMarkIcon
                        onClick={() => toggleChangeEmail(false)}
                        className={clsx(
                            "w-6 h-6 border-black border-[1px] mt-2",
                            'hover:bg-black hover:text-white cursor-pointer',
                        )}
                    />
                </div>
                {sendEmail?.error && (<div className="text-red-500">{sendEmail.error}</div>)}
            </form>
        </div>
    )
};

export default ChangeEmailForm;