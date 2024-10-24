import { clsx } from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/Button";
import Container from "../../../../components/ui/Container";
import CustomPassword from "../../../../components/ui/forms/CustomPassword";
import { useSearchParameters } from "../../../../lib/hooks";
import {
  useChangePasswordMutation,
  useCheckResetPasswordRequestQuery,
} from "../../../../redux/features/api/stuffApiSlice";
import NotFound from "../../../NotFound";

const Reset = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { get } = useSearchParameters();
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { isSuccess, isError } = useCheckResetPasswordRequestQuery({
    token: get("token"),
  });
  const [changePassword, { isSuccess: isChangePasswordSuccess }] =
    useChangePasswordMutation();
  const [isButtonActive, setIsButtonActive] = React.useState(true);

  const handleChangePassword = (e) => {
    e.preventDefault();

    const data = {
      password1: password1,
      password2: password2,
      token: get("token"),
    };

    if (password1 === password2) {
      setIsButtonActive(false);
      setErrorMessage(null);
      changePassword(data)
        .unwrap()
        .catch((err) => null);
    } else {
      setErrorMessage(t("stuff.forms:newPasswordDoesntMatch"));
    }
  };

  if (isChangePasswordSuccess) {
    return (
      <Container className="flex justify-center">
        <div className="flex flex-col">
          <span className="text-2xl">
            {t("stuff.forms:recoverAccessSuccess")}
          </span>
          <Button onClick={() => navigate("/account/signin")} className="px-2">
            {t("stuff.forms:recoverAccessToLogin")}
          </Button>
        </div>
      </Container>
    );
  } else if (isSuccess) {
    return (
      <Container className="flex justify-center">
        <form className="flex flex-col w-2/6" onSubmit={handleChangePassword}>
          <CustomPassword
            htmlFor="password1"
            type="password"
            labelText={t("stuff.forms:recoverAccessNewPass")}
            value={password1}
            onChange={(e) => {
              setPassword1(e.target.value);
              setErrorMessage(null);
            }}
            required={true}
          />
          <CustomPassword
            htmlFor="password2"
            type="password"
            labelText={t("stuff.forms:passwordConfirm")}
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
              setErrorMessage(null);
            }}
            required={true}
          />
          <Button
            type="submit"
            className={clsx("px-2 h-6", isButtonActive && "cursor-not-allowed")}
            disabled={!isButtonActive}
          >
            {t("stuff.forms:recoverAccessChangePass")}
          </Button>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </form>
      </Container>
    );
  } else if (isError) {
    return <NotFound />;
  }
};

export default Reset;
