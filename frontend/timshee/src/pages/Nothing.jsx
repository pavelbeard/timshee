import React from "react";
import t from "../main/translate(old)/TranslateService";
import {useTranslation} from "react-i18next";

const Nothing = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-center items-center p-12">
            <h3>{t('stuff:nothing')}</h3>
        </div>
    )
};

export default Nothing;