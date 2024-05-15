import React from 'react';

import "./NF.css";
import {redirect, useNavigate} from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return(
        <div className="not-found">
            <h1>NOT FOUND</h1>
            <div className="back-to-main" onClick={() => navigate("/")}>BACK TO MAIN</div>
        </div>
    )
};

export default NotFound;