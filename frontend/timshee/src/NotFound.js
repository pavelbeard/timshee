import React from 'react';

import "./NF.css";
import {redirect, useNavigate, useParams} from "react-router-dom";
import translateService from "./main/translate/TranslateService";

const NotFound = () => {
    const navigate = useNavigate();
    const language = translateService.language();

    return(
        <div className="not-found">
            <h1>NOT FOUND</h1>
            <div className="back-to-main" onClick={() => navigate(``)}>BACK TO MAIN</div>
        </div>
    )
};

export default NotFound;