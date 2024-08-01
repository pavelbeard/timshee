import React from "react";
import t from "../main/translate(old)/TranslateService";
import {useTranslation} from "react-i18next";

const Loading = () => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center max-sm:p-8 sm:p-16 md:p-24 lg:p-36">
            <h3 className="text-3xl">{t('stuff:loading')}</h3>
        </div>
    )
};

export default Loading;