import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../pages/Loading";
import { useRefreshQuery } from "../redux/features/api/authApiSlice";
import { selectCurrentToken } from "../redux/features/store/authSlice";

const RequireAuth = ({ element: Element, ...rest }) => {
  const { isLoading } = useRefreshQuery();

  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/account/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
