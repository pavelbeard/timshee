import "./AccountBar.css";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const AccountBar = ({ showAccountBar, hideAccountBar }) => {
    const isAuthenticated = useSelector(state => state.auth.isValid);

    if (isAuthenticated) {
        return (
            <div className="account-container">
                <ul className="account-list">
                    <li className="account-list-item"><Link to="/account/details">Details</Link></li>
                    <li className="account-list-item"><Link to="/account/address-book">Address book</Link></li>
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