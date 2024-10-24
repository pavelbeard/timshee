import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import { useFocus } from "../lib/hooks";

const Contacts = () => {
  const h1Ref = useFocus("/contacts");
  const { t } = useTranslation();
  return (
    <Container className={"mx-12"}>
      <h1 tabIndex="-1" ref={h1Ref} className="text-2xl">
        {t("stuff:contacts")}
      </h1>
      <section>
        <ul>
          <li>
            <span>email: </span>{" "}
            <Link
              className="underline underline-offset-2"
              to="mailto:timsheestore@gmail.com"
            >
              timsheestore@gmail.com
            </Link>
          </li>
          <li>
            <span>{t("stuff:phone")}: </span> <span> ±7 (968) 949-00-14</span>
          </li>
        </ul>
      </section>
    </Container>
  );
};

export default Contacts;
