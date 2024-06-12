import React from "react";
import t from "./translate/TranslateService";

const StartPage = () => {
    const language = t.language();

    return (
        <div style={{ paddingTop: "10px", display: "flex", justifyContent: "center" }}>
            <h3>{t.stuff.startPage[language]}</h3>
        </div>
    )
};

export default StartPage;