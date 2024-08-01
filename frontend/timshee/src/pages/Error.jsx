import React from "react";
import t from "../main/translate(old)/TranslateService";
import {useTranslation} from "react-i18next";

const Error = () => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center pt-12">
            <h3>{t('stuff:error500')}</h3>
        </div>
    )
};

export default Error;