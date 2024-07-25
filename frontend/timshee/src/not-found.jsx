import React from 'react';

import {useNavigate} from "react-router-dom";
import {Button} from "./components/button";
import {useTranslation} from "react-i18next";

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return(
        <div className="flex justify-center p-6">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl">404 | NOT FOUND</h1>
                <Button className="p-6 text-2xl" onClick={() => navigate('/')}>
                    {"BACK TO MAIN"}
                </Button>
            </div>
        </div>
    )
};

export default NotFound;