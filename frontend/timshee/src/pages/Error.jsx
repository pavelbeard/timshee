import React from "react";
import t from "../main/translate(old)/TranslateService";
import {useTranslation} from "react-i18next";
import Container from "../components/ui/Container";

const Error = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <div className=" flex justify-center items-center mt-20">
                <h1 className="text-2xl">{t('stuff:error500')}</h1>
            </div>
        </Container>
    )
};

export default Error;