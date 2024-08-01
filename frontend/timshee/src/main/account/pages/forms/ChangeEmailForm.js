import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthService from "../../../api/authService";
import {changeEmail} from "./reducers/asyncThunks";

import "../Forms.css";
import crossBtn from "../../../../media/static_images/cruz.svg";
import t from "../../../translate/TranslateService";
import {useNavigate} from "react-router-dom";
import {toggleChangeEmail} from "../../../../redux/slices/menuSlice";
import {resetChangeEmailStatus} from "./reducers/accountSlice";
import {selectCurrentToken} from "../../../../redux/services/features/auth/authSlice";

const ChangeEmailForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(selectCurrentToken);
    const language = t.language();
    const {changedEmail, changeEmailStatus} = useSelector(state => state.account);
    const [newEmail, setNewEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        if (changedEmail) {
            navigate("/account/details")
        }
    }, [changedEmail]);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(changeEmail({
            token,
            data: {
                email: newEmail,
            }
        }));
    };

    useEffect(() => {
        if (changeEmailStatus === 'success') {
            dispatch(toggleChangeEmail());
        }
    }, [changeEmailStatus])


    return (
        <div className="overlay form-container">
            <form onSubmit={handleSubmit} className="forms-form height-200">
                <span className="form-title">{t.forms.changeEmail[language]}</span>
                <span className="error-field">{changeEmailStatus === 'error' && t.stuff.emailExists[language]}</span>
                <div>
                    <label htmlFor="firstName">
                        <span className="label-text">{t.forms.newEmail[language]}</span>
                        <input
                            id="firstName"
                            type="email"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            required/>
                    </label>
                </div>
                <div>
                    <button onSubmit={handleSubmit}>{t.forms.submit[language]}</button>
                    <img src={crossBtn} onClick={() => dispatch(toggleChangeEmail())} alt="alt-cross-btn" height={20}/>
                </div>
            </form>
        </div>
    )
};

export default ChangeEmailForm;