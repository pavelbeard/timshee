import "./Account.css";
import React from "react";
import {useNavigate} from "react-router-dom";
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
        <div className="account common account-authorized">
            <div className="first-block">
                Account:
                <form onClick={logoutF}>
                    <button type="submit">Logout</button>
                </form>
            </div>
            <div className="second-block">
                <Addresses showInAccountPrimaryOne={true}/>
            </div>
        </div>
    )
};

export default Account;