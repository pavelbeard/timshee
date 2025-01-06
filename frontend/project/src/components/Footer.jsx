import { CreditCardIcon, LanguageIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  useChangeLanguageMutation,
  useGetDynamicSettingsQuery,
  useGetLanguagesQuery,
} from "../redux/features/api/stuffApiSlice";
import UnderlineDynamic from "./ui/UnderlineDynamic";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { data: languages } = useGetLanguagesQuery();
  const { data: dynSetts } = useGetDynamicSettingsQuery();
  const [changeLanguageMut] = useChangeLanguageMutation();

  const changeLang = (e) => {
    const lang = e.currentTarget.getAttribute("id");
    changeLanguageMut({ lang })
      .unwrap()
      .then(() => i18n.changeLanguage(Cookies.get("server_language")))
      .catch(() => null);
  };

  const languagesMenu = languages?.map((item, idx) => (
    <li
      key={idx}
      id={item.language}
      className="group mx-1 cursor-pointer"
      onClick={changeLang}
    >
      {item.translation}
      <UnderlineDynamic underline={item.language === i18n.language} />
    </li>
  ));

  return (
    <footer>
      <section className="flex w-full border-t-[1px] border-gray-200 px-4 py-1">
        <nav className="m-1 flex items-center p-2">
          <span>{t("stuff:paymentOptions")}</span>
          <CreditCardIcon className="mx-2 size-4" strokeWidth="0.5" />
          {dynSetts?.international && (
            <>
              <span className="border-l-[1px] border-gray-200 pl-2">
                {t("stuff:languages")}
              </span>
              <LanguageIcon strokeWidth="0.5" className="ml-2 size-4" />
              <ul className="flex flex-row">{languagesMenu}</ul>
            </>
          )}
        </nav>
      </section>
      <section className="relative flex flex-col border-t-[1px] p-4 bg-gray-50">
        <nav className="px-2">
          <ul className="flex flex-col lg:flex-row">
            <li className="m-1">© Timshee</li>
            <li className="m-1">
              <Link to="mailto:timsheestore@gmail.com">
                timsheestore@gmail.com
              </Link>
            </li>
            <li className="m-1">{t("stuff:siteCreated")}</li>
          </ul>
        </nav>
        {/*<nav className="nav contact-container">*/}
        {/*    <ul className="nav-list footer-list">*/}
        {/*        <li className="nav-item"><Link to="">Telegram</Link></li>*/}
        {/*    </ul>*/}
        {/*</nav>*/}
        <nav className="px-2">
          <ul className="flex flex-col lg:flex-row">
            <li className="m-1">
              <Link to="/privacy">Privacy&Cookie</Link>
            </li>
            <li className="m-1">
              <Link to="/offer">{t("stuff:offer")}</Link>
            </li>
            <li className="m-1">
              <Link to="/contacts">{t("stuff:contacts")}</Link>
            </li>
            {/*<li className="nav-item"><Link to="">Twi</Link></li>*/}
            {/*<li className="nav-item"><Link to="">Telegram</Link></li>*/}
          </ul>
        </nav>
      </section>
    </footer>
  );
}
