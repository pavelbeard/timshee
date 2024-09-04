import React, {useState} from "react";

import {clsx} from "clsx";
import CustomInput from "../../ui/forms/CustomInputNew";
import Button from "../../ui/Button";
import CustomTitle from "../../ui/forms/CustomTitle";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../../redux/features/store/authSlice";
import {useGenerateTokenMutation} from "../../../redux/features/api/stuffApiSlice";

const ChangeEmailForm = ({ onClose }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState(useSelector(selectCurrentUser));
    const [generateTokenMut, { error: genTokenErr, isError }] = useGenerateTokenMutation();
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);

    const formContainer = clsx(
        'w-10/12',
        'md:w-3/5',
        'lg:w-2/5',
    );

    const handleSubmit = async e => {
        e.preventDefault();
        generateTokenMut({ email }).unwrap()
            .then(() => setMsg(t('account.forms:confirmationMail')))
            .catch(err => {
                if (err?.status === 400) {
                    setError(400)
                }
            });
    };

    const btn = <XMarkIcon
        strokeWidth="0.5"
        onClick={onClose}
        className={clsx(
            "size-6 border-black border-[1px] mt-2",
            'hover:bg-black hover:text-white cursor-pointer',
        )}
    />


    if (msg) {
        return (
            <div className="bg-white flex flex-col items-center justify-center p-6" onClick={e => e.stopPropagation()}>
                <span>{msg}</span>
                {btn}
            </div>
        )
    } else {
        return (
            <div
                className="flex bg-white w-10/12 lg:w-1/2 h-7/12 lg:h-3/4 flex-col items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                <CustomTitle title={t('account.forms:changeOrConfirmEmail')}/>
                <form onSubmit={handleSubmit} className={clsx('flex flex-col', formContainer)}>
                    <CustomInput
                        htmlFor="email"
                        type="email"
                        labelText={t('account.forms:newEmail')}
                        required={true}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                        <div className="w-1/2">
                            <Button className="h-6">{t('account.forms:submit')}</Button>
                        </div>
                        {btn}
                    </div>
                    {error || isError && <div className="text-red-500">
                        {t(`errors:${error|| genTokenErr?.status}`)}
                    </div>}
                </form>
            </div>
        )
    }
};

export default ChangeEmailForm;