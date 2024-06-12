import React from "react";
import t from "./translate/TranslateService";

const Nothing = () => {
    const language = t.language();

    return (
        <div style={{ paddingTop: "10px", display: "flex", justifyContent: "center" }}>
            <h3>{t.stuff.nothing[language]}</h3>
        </div>
    )
};

export default Nothing;