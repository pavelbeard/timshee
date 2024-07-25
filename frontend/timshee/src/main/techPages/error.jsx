import React from "react";
import t from "../translate/TranslateService";

const Error = () => {
    const language = t.language();

    return (
        <div className="flex justify-center items-center pt-12">
            <h3>{t.stuff.error500[language]}</h3>
        </div>
    )
};

export default Error;