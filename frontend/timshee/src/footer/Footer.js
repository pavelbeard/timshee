import React from 'react';
import "./Footer.css";
import {Link, useParams} from "react-router-dom";
import translateService from "../main/translate/TranslateService";

const Footer = () => {
    const language = translateService.language();

    return (
        <div className="footer">
            <nav className="nav contact-container">
                <ul className="nav-list footer-list">
                    <li className="nav-item">© Timshee</li>
                    <li className="nav-item"><a href="mailto:timsheestore@gmail.com">timsheestore@gmail.com</a></li>
                    <li className="nav-item">{translateService.siteCreated[language]}</li>
                </ul>
            </nav>
            <nav className="nav contact-container">
                <ul className="nav-list footer-list">
                    <li className="nav-item"><Link to="">Insta</Link></li>
                    <li className="nav-item"><Link to="">Twi</Link></li>
                    <li className="nav-item"><Link to="">Telegram</Link></li>
                </ul>
            </nav>
            <nav className="nav contact-container">
                <ul className="nav-list footer-list">
                    <li className="nav-item"><Link to="/privacy-information">Privacy&Cookie</Link></li>
                    {/*<li className="nav-item"><Link to="">Twi</Link></li>*/}
                    {/*<li className="nav-item"><Link to="">Telegram</Link></li>*/}
                </ul>
            </nav>
        </div>
    );
}

export default Footer;