import React from 'react';
import {useTranslation} from "react-i18next";
import Container from "../components/ui/Container";

const OnMaintenance = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <h3>{t('stuff:nothing')}</h3>
        </Container>
    )
};

export default OnMaintenance;