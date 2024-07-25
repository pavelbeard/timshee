import React from 'react';
import { Link } from "react-router-dom";
import t from "../main/translate/TranslateService";

import payWithCard from "../media/static_images/icons8-credit-card-80.png";

export default function Footer() {
    const language = t.language();

    return (
        <div className="relative flex max-md:flex-col md:flex-row md:justify-between border-t-[1px] md:p-10">
            <nav className="flex flex-col p-2">
                <ul className="max-md:ml-2">
                    <li className="nav-item">© Timshee</li>
                    <li className="nav-item"><Link to="mailto:timsheestore@gmail.com">timsheestore@gmail.com</Link></li>
                    <li className="nav-item">{t.siteCreated[language]}</li>
                </ul>
            </nav>
            {/*<nav className="nav contact-container">*/}
            {/*    <ul className="nav-list footer-list">*/}
            {/*        <li className="nav-item"><Link to="">Telegram</Link></li>*/}
            {/*    </ul>*/}
            {/*</nav>*/}
            <nav className="flex flex-col p-2">
                <ul className="ml-2">
                    <li className="nav-item"><Link to="/privacy-information">Privacy&Cookie</Link></li>
                    <li className="nav-item"><Link to="/offer">{t.stuff.offer[language]}</Link></li>
                    <li className="nav-item"><Link to="/contacts">{t.stuff.contacts[language]}</Link></li>
                    {/*<li className="nav-item"><Link to="">Twi</Link></li>*/}
                    {/*<li className="nav-item"><Link to="">Telegram</Link></li>*/}
                </ul>
            </nav>
            <nav className="flex flex-col p-2">
                <ul className="max-md:ml-2 md:mr-10">
                    <li className="nav-item" style={{display: "flex", flexDirection: "column"}}>
                        <span>{t.stuff.paymentOptions[language]}</span>
                        <span>
                            <img src={payWithCard} alt="alt-pay-with-card" className="h-[30px]"/>
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}