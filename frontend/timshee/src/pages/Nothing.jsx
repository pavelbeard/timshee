import { useTranslation } from "react-i18next";

const Nothing = ({ reason }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <h3>{reason ? reason : t("stuff:nothing")}</h3>
    </div>
  );
};

export default Nothing;
