import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";

const OnContentUpdate = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <h3>{t("stuff:nothing")}</h3>
    </Container>
  );
};

export default OnContentUpdate;
