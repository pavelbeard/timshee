import React from "react";
import t from "../translate/TranslateService";

const Error = () => {
    const language = t.language();

    return (
        <div style={{ paddingTop: "10px", display: "flex", justifyContent: "center" }}>
            <h3>{t.stuff.error500[language]}</h3>
        </div>
    )
};

export default Error;