import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {checkEmail} from "../../../forms/reducers/asyncThunks";
import {Navigate, useNavigate} from "react-router-dom";

const SendEmailForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {checkedEmail, checkEmailStatus} = useSelector(state => state.account);
    const [email, setEmail] = useState('');
    const [isButtonActive, setIsButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleCheckEmail = (e) => {
        e.preventDefault();
        const data = {
            email: email,
        };

        dispatch(checkEmail({data}));
        setIsButtonActive(false);
    };

    useEffect(() => {
        if (checkEmailStatus === 'error') {
            setErrorMessage('email не найден');
        }
    }, [checkEmailStatus]);

    if (checkEmailStatus === 'success') {
        return (
            <div className="flex-center flex-column">
                <span>
                    На вашу почту должна придти ссылка на форму восстановления пароля. <br/>
                    Проверьте папку "Спам" на всякий случай.
                </span>
            </div>
        )
    } else {
        return(
            <div className="flex-center flex-column">
                <form className="flex a-start flex-column" onSubmit={handleCheckEmail}>
                    <div className="mb-10 w-100">
                        <label className="flex-center flex-column a-start" htmlFor="email">
                            <span className="mb-10">Введите email:</span>
                            <input
                                className="w-100 input-beautiful"
                                type="email"
                                id="email"
                                aria-placeholder="Введите свой email для восстановления доступа к аккаунту"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsButtonActive(true);
                                    setErrorMessage(null);
                                }}
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-10 w-100">
                        <button type="submit"
                                className={`${isButtonActive ? 'btn-beautiful' : 'btn-beautiful disabled'}`}
                                disabled={!isButtonActive}>
                            Восстановить доступ к аккаунту
                        </button>
                    </div>
                    {errorMessage && (
                        <div>{errorMessage}</div>
                    )}
                </form>
            </div>
        )
    }
};

export default SendEmailForm;