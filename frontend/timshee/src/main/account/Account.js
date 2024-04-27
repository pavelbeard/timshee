import "./Account.css";
import {useState} from "react";
import {useNavigate, redirect} from "react-router-dom";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {checkAuthStatus} from "../../redux/slices/checkAuthSlice";
import Addresses from "./Addresses";

const API_URL = process.env.REACT_APP_API_URL;

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const csrftoken = Cookies.get("csrftoken");
    const {isValid} = useSelector(state => state.auth);

    const [addresses, setAddresses] = useState([]);

    const getAddresses = async () => {
        const userId = Number(localStorage.getItem("userId"));
        const response = await fetch(API_URL + `api/order/addresses/${userId}/`, {
            credentials: "include",
        });
        const json = await response.json();
        setAddresses(json)
    }

    const logoutF = async (e) => {
        e.preventDefault();

        try {
            await fetch(API_URL + "api/stuff/logout/", {
                method: "POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                credentials: "include",
            });

            localStorage.clear();
            dispatch(checkAuthStatus())
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    }

    if (!isValid) {
        return (
            <div className="account common">
                Forbidden...
            </div>
        )
    }

    return (
        <div className="account common">
            <div>
                Account:
                <form onClick={logoutF}>
                    <button type="submit">Logout</button>
                </form>
            </div>
            <div className="addresses">
                <Addresses showInAccountPrimaryOne={true}/>
            </div>
        </div>
    )
};

export default Account;