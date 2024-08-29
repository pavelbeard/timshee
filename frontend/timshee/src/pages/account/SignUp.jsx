import React, {useEffect} from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import CustomInput from "../../components/ui/forms/CustomInput";
import Button from "../../components/ui/Button";
import {clsx} from "clsx";
import CustomTitle from "../../components/ui/forms/CustomTitle";
import {useTranslation} from "react-i18next";
import {useInput} from "../../lib/hooks";
import {useSignUpMutation} from "../../redux/features/api/authApiSlice";
import {changePassword} from "../../main/api(old)/actions";
import SignFormContainer from "../../components/account/SignFormContainer";

const SignUp = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        "first_name": "",
        "last_name": "",
        email: "",
    });
    const [signUp] = useSignUpMutation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        if (error || passwordError) {
            setError(null);
            setPasswordError(null);
        }
    }, [formData, password, confirmPassword]);

    const setData = e => {
        setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords aren't matching!");
            return;
        }

        signUp({...formData, password, password2: confirmPassword }).unwrap()
            .then(() => {
                // reset();
                navigate(`/account/signin`);
            })
            .catch((err) => {
                setError(err?.message);
            });
    };


    return (
        <SignFormContainer>
            <div></div>
            <form className="flex flex-col md:w-4/12 lg:w-4/12 pb-6" onSubmit={handleSubmit}>
                <CustomTitle title={t('stuff.forms:signUpTitle')} />
                <CustomInput
                    htmlFor="first_name"
                    name="first_name"
                    type="text"
                    labelText={t('stuff.forms:firstname')}
                    value={formData.first_name}
                    onChange={setData}
                    required={true}
                />
                <CustomInput
                    htmlFor="last_name"
                    name="last_name"
                    type="text"
                    labelText={t('stuff.forms:lastname')}
                    value={formData.last_name}
                    onChange={setData}
                    required={true}
                />
                <CustomInput
                    htmlFor="username"
                    name="username"
                    type="email"
                    labelText="email:"
                    value={formData.email}
                    onChange={setData}
                    required={true}
                />
                <CustomInput
                    htmlFor="password"
                    name="password"
                    type="password"
                    labelText={t('stuff.forms:password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required={true}
                />
                <CustomInput
                    htmlFor="password2"
                    name="password2"
                    type="password"
                    labelText={t('stuff.forms:passwordConfirm')}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required={true}
                />
                <Button type="submit" className="h-6">{t('stuff.forms:register')}</Button>
                {(error || passwordError) && (<div className="text-red-500">{error || passwordError}</div>)}
            </form>
            <div></div>
        </SignFormContainer>
    )
};

export default SignUp;