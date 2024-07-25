import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import CustomInput from "../../../../../../components/custom-input";
import {Button} from "../../../../../../components/button";
import {clsx} from "clsx";
import {useToken} from "../../../../../../lib/global/hooks";
import ToChangePassword from "../../../../../../emails/to-change-password";
import { checkEmail } from "../../../../../../lib/stuff";
import {sendEmail} from "../../../../../../emails";

const SendEmailForm = () => {
    const token = useToken();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [isButtonActive, setIsButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleCheckEmail = async e => {
        e.preventDefault();

        const result = await checkEmail({data: {email}});

        if (result instanceof Error) {
            setErrorMessage(t(`stuff.forms:recoverAccessEmailNotExists`));
            return
        }

        const sendEmailResult =  await sendEmail(
            token,
            email,
            `Timshee | ${t('stuff.forms:recoverAccessEmail')}`,
            <ToChangePassword
                link={`-SITE_URL-account/password/reset/${result.uuid}/`}
                h2={t('stuff.forms:recoverAccessChangePassEmail')}
                text={{p1: t('stuff.forms:recoverAccessTextEmail'), p2: t('stuff.forms:recoverAccessAttentionEmail')}}
                linkLabel={t('stuff.forms:recoverAccessLinkLabelEmail')}
            />
        );

        if (sendEmailResult instanceof Error) {
            setErrorMessage(sendEmailResult.message);
            return
        }

        setIsButtonActive(false);
        setSuccess(true);
    };



    if (success) {
        return (
            <div className="flex justify-center text-2xl">
                {t('stuff.forms:recoverAccessSpamNote')}
            </div>
        )
    } else {
        return(
            <div className="flex justify-center">
                <form className="flex flex-col" onSubmit={handleCheckEmail}>
                    <CustomInput
                        htmlFor="email"
                        type="email"
                        labelText={t('stuff.forms:recoverAccessEmail')}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsButtonActive(true);
                            setErrorMessage(null);
                        }}
                    />
                    <Button
                        type="submit"
                        className={clsx(
                            'px-2',
                            isButtonActive && 'cursor-not-allowed'
                        )}
                        disabled={!isButtonActive
                    }>
                        {t('stuff.forms:recoverAccess')}
                    </Button>
                    {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                    )}
                </form>
            </div>
        )
    }
};

export default SendEmailForm;