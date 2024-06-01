import "./AccountBar.css";
import React from "react";
import {Link} from "react-router-dom";
import AuthService from "../main/api/authService";

const AccountBar = ({ showAccountBar, hideAccountBar }) => {
    const isAuthenticated = AuthService.isAuthenticated();

    if (isAuthenticated) {
        return (
            <div className="account-container">
                <ul className="account-list">
                    <li className="account-list-item"><Link to="/account/details">Details</Link></li>
                    <li className="account-list-item"><Link to="/account/details/addresses">Address book</Link></li>
                </ul>
            </div>
        )
    }

    return (
        <div className="account-container" onMouseEnter={showAccountBar} onMouseLeave={hideAccountBar}>
            <ul className="account-list">
                <li className="login"><Link to="/account/login">Login</Link></li>
                <li className="register"><Link to="/account/register">Register</Link> </li>
                <li className="wish-list">Wishlist (0)</li>
            </ul>
        </div>
    )
};

export default AccountBar;