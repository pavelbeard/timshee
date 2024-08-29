import {useNavigate} from "react-router-dom";
import CustomTitle from "../../ui/forms/CustomTitle";
import Button from "../../ui/Button";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../../lib/hooks";
import {useChangeEmailMutation} from "../../../redux/features/api/stuffApiSlice";

export default function ConfirmEmailForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { get } = useSearchParameters();
    const [changeEmailMut] = useChangeEmailMutation();
    const [error, setError] = useState(null);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

    useEffect(() => {
        if(isEmailConfirmed) {
            setTimeout(() => navigate('/account/details'), 1500)
        }
    }, [isEmailConfirmed]);

    const handleSubmit = async e => {
        e.preventDefault();
        changeEmailMut({ token: get('token') }).unwrap()
            .then(() => setIsEmailConfirmed(true))
            .catch(err => {
                if (err?.status === 400) {
                    setError(t('errors:400changeEmail'))
                }
            });
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