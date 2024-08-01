import React from "react";
import {useTranslation} from "react-i18next";
import {clsx} from "clsx";
import {Link} from "react-router-dom";

const PrivacyInfo = () => {
    const { i18n } = useTranslation();
    const privacyInfoTextStyle = clsx(
        "flex flex-col items-left py-6 px-12",
    );

    const privacyInfoHeaderStyle = clsx(
        'text-2xl',
    );

    const emailUnderline = clsx(
        'underline underline-offset-2'
    );
    switch (i18n.language) {
        case "en":
            return (
                <div className={clsx(privacyInfoTextStyle)}>
                    <h1 className={clsx(privacyInfoHeaderStyle)}>Privacy policy</h1>
                    <h2 className={clsx(privacyInfoHeaderStyle)}>Date of last change: 12/06/2024</h2>
                    <div style={{wordBreak: "break-word"}}>
                        <h2>Introduction</h2>
                        <p>Your privacy is important to us. This Privacy Policy describes how we collect, use, disclose,
                            and
                            protect your personal information when you visit our website timshee.ru (hereinafter
                            referred to as
                            the "Site").</p>
                        <h3>1. Information Collection</h3>
                        <p>We collect the following types of information:</p>
                        <ul>
                            <li>Personal Information: Name, email address, and other data that you provide to us when
                                registering on the Site, subscribing to newsletters, or filling out forms. We do not
                                collect
                                your payment card information.
                            </li>
                            <li>Automatically Collected Information: We collect session data, browser information, and
                                browser
                                type.
                            </li>
                        </ul>
                        <h3>2. Use of Information</h3>
                        <p>We use your information for the following purposes:</p>
                        <ul>
                            <li>Providing and improving our services;</li>
                            <li>Sending notifications and marketing materials;</li>
                            <li>Responding to your inquiries and providing support;</li>
                            <li>Analyzing Site usage to improve its functionality;</li>
                            <li>Complying with legal requirements and protecting our rights.</li>
                        </ul>
                        <h3>3. Information Disclosure</h3>
                        <p>
                            We do not sell, trade, or transfer your personal information to third parties without your
                            consent,
                            except in the following cases:
                        </p>
                        <ul>
                            <li>Service providers who assist us in managing our business and providing services to you
                                (e.g.,
                                hosting providers, payment systems, etc.);
                            </li>
                            <li>
                                When required by law or to protect our rights and interests.
                            </li>
                        </ul>
                        <h3>4. Information Protection</h3>
                        <p>
                            We take reasonable measures to protect your personal information from unauthorized access,
                            alteration, disclosure, or destruction. These measures include technical, administrative,
                            and
                            physical security measures.
                        </p>
                        <h3>5. Cookies</h3>
                        <p>
                            In the current version of the privacy policy, cookies are only used to provide access to
                            your orders
                            and
                            addresses in the account of a registered user.
                        </p>
                        <h3>6. Your Rights</h3>
                        <p>You have the following rights:</p>
                        <ul>
                            <li>Access to your personal information;</li>
                            <li>Correction of inaccurate or incomplete information;</li>
                            <li>Deletion of your personal information;</li>
                            <li>Restriction or objection to the processing of your information.</li>
                            <li>Data Portability: Data portability is not currently implemented.</li>
                        </ul>
                        <p>To exercise these rights, please contact us at <Link
                            className={clsx(emailUnderline)}
                            to="mailto:timsheestore@gmail.com?Subject=Privacy%20rights">timsheestore@gmail.com.</Link>
                        </p>
                        <h3>7. Changes to the Privacy Policy</h3>
                        <p>
                            We reserve the right to change this Privacy Policy at any time. All changes will be posted
                            on this
                            page,
                            and the date of the last update will be indicated at the top of the document.
                        </p>
                    </div>
                </div>
            )
        case "ru":
            return (
                <div className={clsx(privacyInfoTextStyle)}>
                    <h1 className={clsx(privacyInfoHeaderStyle)}>Политика конфиденциальности </h1>
                    <h2 className={clsx(privacyInfoHeaderStyle)}>Дата последнего изменения: 12/06/2024</h2>
                    <div style={{wordBreak: "break-word"}}>
                        <h2>Вступление</h2>
                        <p>Ваша конфиденциальность очень важна для нас. В данной Политике конфиденциальности
                            описывается,
                            как мы собираем, используем, раскрываем и защищаем вашу личную информацию
                            при посещении нашего сайта timshee.ru (далее - "Сайт").
                        </p>
                        <h3>1. Сбор информации</h3>
                        <p>Мы собираем следующие виды информации:</p>
                        <ul>
                            <li>
                                Персональная информация: Имя, адрес электронной почты и другие данные,
                                которые вы предоставляете нам при регистрации на Сайте,
                                подписке на рассылку или заполнении форм. Мы не собираем данные ваших платежных карт.
                            </li>
                            <li>
                                Автоматически собираемая информация:
                                Мы собираем данные сессий, информацию о вашем браузере и его типе.
                            </li>
                        </ul>
                        <h3>2. Использование информации</h3>
                        <p>Мы используем вашу информацию для следующих целей:</p>
                        <ul>

                            <li>Предоставление и улучшение наших услуг;</li>
                            <li>Отправка уведомлений и маркетинговых материалов;</li>
                            <li>Ответ на ваши запросы и предоставление поддержки;</li>
                            <li>Анализ использования Сайта для улучшения его функциональности;</li>
                            <li>Соблюдение правовых требований и защита наших прав.</li>
                        </ul>
                        <h3>3. Раскрытие информации</h3>
                        <p>
                            Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам без вашего
                            согласия,
                            за исключением следующих случаев:
                        </p>
                        <ul>
                            <li>
                                Поставщики услуг, которые помогают нам в управлении нашим бизнесом и предоставлении
                                услуг вам
                                (например, хостинг-провайдеры, платежные системы и т.д.);
                            </li>
                            <li>
                                В случаях, предусмотренных законом или для защиты наших прав и интересов.
                            </li>
                        </ul>
                        <h3>4. Защита информации</h3>
                        <p>
                            Мы принимаем разумные меры
                            для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или
                            уничтожения.
                            Эти меры включают технические, административные и физические меры безопасности.
                        </p>
                        <h3>5. Cookies</h3>
                        <p>
                            В настоящей версии политики конфиденциальности файлы cookie
                            используются лишь для предоставления доступа к вашим заказам, адресам в аккаунте
                            зарегистрированного
                            пользователя.
                        </p>
                        <h3>6. Ваши права</h3>
                        <p>Вы имеете следующие права:</p>
                        <ul>
                            <li>Доступ к вашей личной информации;</li>
                            <li>Исправление неточной или неполной информации;</li>
                            <li>Удаление вашей личной информации;</li>
                            <li>Ограничение или возражение против обработки вашей информации.</li>
                            <li>Перенос данных: Перенос информации пока не реализован.</li>
                        </ul>
                        <p>Для реализации этих прав свяжитесь с нами по адресу электронной почты:
                            <Link
                                className={clsx(emailUnderline)}
                                to="mailto:timsheestore@gmail.com?Subject=Privacy%20rights">timsheestore@gmail.com.</Link></p>
                        <h3>7. Изменения в Политике конфиденциальности</h3>
                        <p>
                            Мы оставляем за собой право изменять данную Политику конфиденциальности в любое время.
                            Все изменения будут опубликованы на этой странице,
                            и дата последнего обновления будет указана вверху документа.
                        </p>
                    </div>
                </div>
            )
    }

};

export default PrivacyInfo;