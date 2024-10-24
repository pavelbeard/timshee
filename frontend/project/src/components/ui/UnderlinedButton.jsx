import { Link } from "react-router-dom";

export default function UnderlinedButton({ children, ...rest }) {
  if (rest?.className.split(" ").find((c) => c === "disabled")) {
    return <span {...rest}>{children}</span>;
  }

  return <Link {...rest}>{children}</Link>;
}
