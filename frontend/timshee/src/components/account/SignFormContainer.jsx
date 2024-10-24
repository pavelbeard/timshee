import { clsx } from "clsx";

export default function SignFormContainer({ children }) {
  return (
    <div className={clsx("flex min-h-screen mt-3 mx-16 md:mx-40 xl:mx-80")}>
      {children}
    </div>
  );
}
