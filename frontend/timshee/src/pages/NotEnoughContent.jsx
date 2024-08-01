import React from "react";
import {useTranslation} from "react-i18next";

const NotEnoughContent = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center pt-12">
            <h3>{t('stuff:startPage')}</h3>
        </div>
    )
};

export default NotEnoughContent;