import React from "react";
import t from "../translate/TranslateService";

const StartPage = () => {
    const language = t.language();

    return (
        <div className="flex flex-col items-center justify-center pt-12">
            <h3>{t.stuff.startPage[language]}</h3>
        </div>
    )
};

export default StartPage;