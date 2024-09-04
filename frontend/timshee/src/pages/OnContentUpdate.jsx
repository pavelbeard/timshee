import React from 'react';
import Container from "../components/ui/Container";
import {useTranslation} from "react-i18next";

const OnContentUpdate = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <h3>{t('stuff:nothing')}</h3>
        </Container>
    )
};

export default OnContentUpdate;