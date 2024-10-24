import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SignFormContainer from "../../components/account/SignFormContainer";
import Button from "../../components/ui/Button";
import CustomInput from "../../components/ui/forms/CustomInputNew";
import CustomPassword from "../../components/ui/forms/CustomPassword";
import CustomTitle from "../../components/ui/forms/CustomTitle";
import { useSignUpMutation } from "../../redux/features/api/authApiSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [signUp] = useSignUpMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    if (error || passwordError) {
      setError(null);
      setPasswordError(null);
    }
  }, [formData, password, confirmPassword]);

  const setData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords aren't matching!");
      return;
    }

    signUp({
      ...formData,
      username: formData.email,
      password,
      password2: confirmPassword,
    })
      .unwrap()
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
      <form className="flex flex-col w-full pb-6" onSubmit={handleSubmit}>
        <CustomTitle title={t("stuff.forms:signUpTitle")} />
        <CustomInput
          htmlFor="first_name"
          name="first_name"
          type="text"
          labelText={t("stuff.forms:firstname")}
          value={formData.first_name}
          onChange={setData}
          required={true}
        />
        <CustomInput
          htmlFor="last_name"
          name="last_name"
          type="text"
          labelText={t("stuff.forms:lastname")}
          value={formData.last_name}
          onChange={setData}
          required={true}
        />
        <CustomInput
          htmlFor="email"
          name="email"
          type="email"
          labelText="email:"
          value={formData.email}
          onChange={setData}
          required={true}
        />
        <CustomPassword
          htmlFor="password"
          name="password"
          labelText={t("stuff.forms:password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        <CustomPassword
          htmlFor="password2"
          name="password2"
          labelText={t("stuff.forms:passwordConfirm")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required={true}
        />
        <Button type="submit" className="h-6">
          {t("stuff.forms:register")}
        </Button>
        {(error || passwordError) && (
          <div className="text-red-500">{error || passwordError}</div>
        )}
      </form>
    </SignFormContainer>
  );
};

export default SignUp;
