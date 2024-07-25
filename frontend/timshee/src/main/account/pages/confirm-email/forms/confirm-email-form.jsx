import {useNavigate, useParams} from "react-router-dom";
import {useEmailStore} from "../../../../../store";
import {useToken} from "../../../../../lib/global/hooks";
import CustomTitle from "../../../../../components/custom-title";
import {Button} from "../../../../../components/button";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";

export default function ConfirmEmailForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { encodedEmail } = useParams();
    const { error, toggleConfirmEmail, isEmailConfirmed, changeEmail } = useEmailStore();
    const token = useToken();

    useEffect(() => {
        if(isEmailConfirmed) {
            setTimeout(() => navigate('/account/details'), 1500)
        }
    }, [isEmailConfirmed]);

    const handleSubmit = async e => {
        e.preventDefault();
        const decodedEmail = decodeURIComponent(encodedEmail);
        await changeEmail(token, decodedEmail)

        if (!error) {
            toggleConfirmEmail();
        }
    }

    return(
        <div className="flex flex-col items-center">
            <form onSubmit={handleSubmit}>
                <CustomTitle title={'Подтверждение email'} />
                <Button type="submit">{t('account.forms:submit')}</Button>
                {isEmailConfirmed ?
                    (<div className="text-green-500">{t('account.forms:emailConfirmed')}</div>) :
                    error && (<div className="text-red-500">{error}</div>)}
            </form>
        </div>
    )
}