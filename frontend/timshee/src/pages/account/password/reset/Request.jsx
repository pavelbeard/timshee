import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import CustomInput from "../../../../components/ui/forms/CustomInputNew";
import Button from "../../../../components/ui/Button";
import {clsx} from "clsx";
import Container from "../../../../components/ui/Container";
import {useLazyCheckEmailQuery} from "../../../../redux/features/api/stuffApiSlice";

const Request = () => {
    const { t } = useTranslation();
    const [checkEmail] = useLazyCheckEmailQuery();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [isButtonActive, setIsButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleCheckEmail = async e => {
        e.preventDefault();

        checkEmail({ email }).unwrap()
            .then(res => {
                if (res?.status === 200)
                    setIsButtonActive(false);
                    setSuccess(true);
                }
            )
            .catch(() => setErrorMessage(t(`stuff.forms:recoverAccessEmailNotExists`)));
    };

    if (success) {
        return (
            <Container className="flex justify-center text-2xl">
                {t('stuff.forms:recoverAccessSpamNote')}
            </Container>
        )
    } else {
        return(
            <Container className="flex justify-center">
                <form className="flex flex-col mt-3" onSubmit={handleCheckEmail}>
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
                            'px-2 h-6',
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
            </Container>
        )
    }
};

export default Request;