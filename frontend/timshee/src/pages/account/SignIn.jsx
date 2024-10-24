import { useEffect, useState } from "react";
import SignFormContainer from "../../components/account/SignFormContainer";
import SignInForm from "../../components/account/forms/SignInForm";
import { useSignIn } from "../../lib/hooks";
import Loading from "../Loading";

const SignIn = () => {
  const [signIn, isLoading] = useSignIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(username, password, setError, true);
  };

  useEffect(() => {
    setError(null);
  }, [username, password]);

  return (
    <SignFormContainer>
      {isLoading ? (
        <Loading />
      ) : (
        <SignInForm
          submit={handleSubmit}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          error={error}
        />
      )}
    </SignFormContainer>
  );
};

export default SignIn;
