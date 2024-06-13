import React from 'react';
import "./Footer.css";
import {Link, useParams} from "react-router-dom";
import t from "../main/translate/TranslateService";

import payWithCard from "../media/static_images/icons8-credit-card-80.png";

const Footer = () => {
    const language = t.language();

    return (
        <div className="footer">
            <nav className="nav contact-container">
                <ul className="nav-list footer-list">
                    <li className="nav-item">© Timshee</li>
                    <li className="nav-item"><a href="mailto:timsheestore@gmail.com">timsheestore@gmail.com</a></li>
                    <li className="nav-item">{t.siteCreated[language]}</li>
                </ul>
            </nav>
            {/*<nav className="nav contact-container">*/}
            {/*    <ul className="nav-list footer-list">*/}
            {/*        <li className="nav-item"><Link to="">Telegram</Link></li>*/}
            {/*    </ul>*/}
            {/*</nav>*/}
            <nav className="nav contact-container">
                <ul className="nav-list footer-list">
                    <li className="nav-item"><Link to="/privacy-information">Privacy&Cookie</Link></li>
                    {/*<li className="nav-item"><Link to="">Twi</Link></li>*/}
                    {/*<li className="nav-item"><Link to="">Telegram</Link></li>*/}
                </ul>
            </nav>
            <nav className="nav contact-container">
                <ul className="nav-list footer-list">
                    <li className="nav-item" style={{display: "flex", flexDirection: "column"}}>
                        <span>{t.stuff.paymentOptions[language]}</span>
                        <span>
                            <img src={payWithCard} alt="alt-pay-with-card" height={30}/>
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Footer;