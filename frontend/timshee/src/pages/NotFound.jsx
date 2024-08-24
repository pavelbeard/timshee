import React from 'react';

import {useNavigate} from "react-router-dom";
import Button from "../components/ui/Button";
import {useTranslation} from "react-i18next";
import Container from "../components/ui/Container";

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return(
        <Container>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl">404 | {t('errors:404')}</h1>
                <div className="w-1/2">
                    <Button className="text-2xl" onClick={() => navigate('/')}>
                        {t('errors:backToMain')}
                    </Button>
                </div>
            </div>
        </Container>
    )
};

export default NotFound;