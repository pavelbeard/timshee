import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import NotFound from "../../../NotFound";
import {changePassword, checkResetPasswordRequest} from "../../../../main/account(old)/pages/forms/reducers/asyncThunks";
import {useTranslation} from "react-i18next";
import Button from "../../../../components/ui/Button";
import CustomInput from "../../../../components/ui/forms/CustomInput";
import {clsx} from "clsx";

const Reset = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState(null);
    const {
        changePasswordStatus,
        isLinkValidStatus,
    } = useSelector(state => state.account);
    const { t } = useTranslation();
    const [isButtonActive, setIsButtonActive] = React.useState(true);


    const handleChangePassword = (e) => {
        e.preventDefault();

        const data = {
            password1: password1,
            password2: password2,
            uuid: params.uuid,
        };

        if (password1 === password2) {
            setIsButtonActive(false);
            setErrorMessage(null);
            dispatch(changePassword({data}));
        } else {
            setErrorMessage(t('stuff.forms:newPasswordDoesntMatch'));
        }
    };

    useEffect(() => {
        dispatch(checkResetPasswordRequest({data: {uuid: params.uuid}}));
    }, [])

    useEffect(() => {}, [changePasswordStatus, errorMessage]);

    if (changePasswordStatus === 'success') {
        return (
            <div className="flex justify-center">
                <div className="flex flex-col justify-center">
                    <span className="text-2xl">{t('stuff.forms:recoverAccessSuccess')}</span>
                    <Button
                        onClick={() => navigate('/account/signin')}
                        className="px-2"
                    >{t('stuff.forms:recoverAccessToLogin')}
                    </Button>
                </div>
            </div>

        )
    } else if (isLinkValidStatus === 'success') {
        return (
            <div className="flex justify-center">
                <form className="flex flex-col w-2/6" onSubmit={handleChangePassword}>
                <CustomInput
                        htmlFor="password1"
                        type="password"
                        labelText={t('stuff.forms:recoverAccessNewPass')}
                        value={password1}
                        onChange={e => {
                            setPassword1(e.target.value);
                            setErrorMessage(null)
                        }}
                        required={true}
                    />
                    <CustomInput
                        htmlFor="password2"
                        type="password"
                        labelText={t('stuff.forms:passwordConfirm')}
                        value={password2}
                        onChange={e => {
                            setPassword2(e.target.value)
                            setErrorMessage(null)
                        }}
                        required={true}
                    />
                    <Button
                        type="submit"
                        className={clsx(
                            'px-2',
                            isButtonActive && 'cursor-not-allowed'
                        )}
                        disabled={!isButtonActive}
                    >
                        {t('stuff.forms:recoverAccessChangePass')}
                    </Button>
                    {errorMessage &&
                        (<div className="text-red-500">{errorMessage}</div>)}
                </form>
            </div>
        )
    } else if (isLinkValidStatus === 'error') {
        return <NotFound />
    }
};

export default Reset;