import "./AccountBar.css";
import React from "react";
import {Link} from "react-router-dom";
import AuthService from "../main/api/authService";

const AccountBar = () => {
    const token = AuthService.getCurrentUser();

    if (token?.access) {
        return (
            // <div className="account-container">
                <ul className="submenu direction-column">
                    <li className="submenu-item"><Link to="/account/details">Details</Link></li>
                    <li className="submenu-item"><Link to="/account/details/addresses">Address book</Link></li>
                </ul>
            // </div>
        )
    } else {
        return (
            // <div className="account-container">
                <ul className="submenu direction-column">
                    <li className="submenu-item"><Link to="/account/login">Login</Link></li>
                    <li className="submenu-item"><Link to="/account/register">Register</Link> </li>
                    <li className="submenu-item">Wishlist (0)</li>
                </ul>
            // </div>
        )
    }
};

export default AccountBar;