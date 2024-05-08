import React from 'react';

import "../main/Main.css";
import "./SocialNetworks.css";

const SocialNetworks = () => {
    return (
        <nav className="nav contact-container">
            <ul className="nav-list social-net-list">
                <li className="nav-item"><a href="">Insta</a></li>
                <li className="nav-item"><a href="">Twi</a></li>
                <li className="nav-item"><a href="">Telegram</a></li>
            </ul>
        </nav>
    )
}

export default SocialNetworks;