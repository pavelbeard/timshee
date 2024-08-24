import React from 'react';
import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next";
import {CreditCardIcon} from "@heroicons/react/24/outline";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer>
            <section className="flex w-full border-t-[1px] border-gray-200 px-4 py-1">
                <div className="m-1 flex items-center p-2">
                    <span>{t('stuff:paymentOptions')}</span>
                    <CreditCardIcon className="ml-2 size-4" strokeWidth="0.5" />
                </div>
            </section>
            <section className="relative flex flex-col border-t-[1px] p-4 bg-gray-50">
                <nav className="px-2">
                    <ul className="flex flex-col lg:flex-row">
                        <li className="m-1">© Timshee</li>
                        <li className="m-1"><Link to="mailto:timsheestore@gmail.com">timsheestore@gmail.com</Link>
                        </li>
                        <li className="m-1">{t('stuff:siteCreated')}</li>
                    </ul>
                </nav>
                {/*<nav className="nav contact-container">*/}
                {/*    <ul className="nav-list footer-list">*/}
                {/*        <li className="nav-item"><Link to="">Telegram</Link></li>*/}
                {/*    </ul>*/}
                {/*</nav>*/}
                <nav className="px-2">
                    <ul className="flex flex-col lg:flex-row">
                        <li className="m-1"><Link to={'/privacy'}>Privacy&Cookie</Link></li>
                        <li className="m-1"><Link to={'/offer'}>{t('stuff:offer')}</Link></li>
                        <li className="m-1"><Link to={'/contacts'}>{t('stuff:contacts')}</Link></li>
                        {/*<li className="nav-item"><Link to="">Twi</Link></li>*/}
                        {/*<li className="nav-item"><Link to="">Telegram</Link></li>*/}
                    </ul>
                </nav>
            </section>
        </footer>
    );
}