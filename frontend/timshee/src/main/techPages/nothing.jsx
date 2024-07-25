import React from "react";
import t from "../translate/TranslateService";

const Nothing = () => {
    const language = t.language();

    return (
        <div className="flex flex-col justify-center items-center p-12">
            <h3>{t.stuff.nothing[language]}</h3>
        </div>
    )
};

export default Nothing;