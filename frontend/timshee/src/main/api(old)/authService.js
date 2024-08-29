import { API_URL, CSRF_TOKEN } from '../../config';
import Cookies from "js-cookie";



const getAccessToken = () => {
    const access = Cookies.get("access_token");
    if (access) {
        return {access: access};
    }

    return null;
};

const AuthService = {
    getAccessToken,
};

export default AuthService;