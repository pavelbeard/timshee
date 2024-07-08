import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import NotFound from "../../../NotFound";
import {changePassword, checkResetPasswordRequest} from "./reducers/asyncThunks";
import Error from "../../techPages/Error";

const NewPasswordForm = () => {
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
            setErrorMessage('Пароли не совпадают');
        }
    };

    useEffect(() => {
        dispatch(checkResetPasswordRequest({data: {uuid: params.uuid}}));
    }, [])

    useEffect(() => {}, [changePasswordStatus, errorMessage]);

    if (changePasswordStatus === 'success') {
        return (
            <div className="flex flex-center flex-column">
                <span className="mb-5">Пароль успешно изменен!</span>
                <button className="btn-beautiful" onClick={() => navigate('/account/login')}>Перейти к логину</button>
            </div>
        )
    } else if (isLinkValidStatus === 'success') {
        return(
            <div className="flex-center flex-column">
                <form className="flex a-start flex-column" onSubmit={handleChangePassword}>
                    <div className="mb-10 w-100">
                        <label htmlFor="password1">
                            <span>Новый пароль: </span>
                            <input
                                className="w-100 input-beautiful"
                                type="password"
                                id="password1"
                                aria-placeholder="New password"
                                value={password1}
                                onChange={e => setPassword1(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-10 w-100">
                        <label htmlFor="password2" className="flex-center flex-column a-start">
                            <span>Подтверждение пароля: </span>
                            <input
                                className="w-100 input-beautiful"
                                type="password"
                                id="password2"
                                aria-placeholder="Password confirmation"
                                value={password2}
                                onChange={e => setPassword2(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <button type="submit"
                                className={`${isButtonActive ? ' btn-beautiful mb-5': 'btn-beautiful mb-5 disabled'}`}
                                disabled={!isButtonActive}>
                        >
                            Сменить пароль
                        </button>
                    </div>
                    {errorMessage &&
                        (<div>{errorMessage}</div>)}
                </form>
            </div>
        )
    } else if (isLinkValidStatus === 'error') {
        return <NotFound />
    }
};

export default NewPasswordForm;