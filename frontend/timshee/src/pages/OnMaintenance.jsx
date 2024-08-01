import React from 'react';
import t from "../main/translate(old)/TranslateService";

const OnMaintenance = () => {
    const language = t.language();

    return (
        <div style={{ paddingTop: "10px", display: "flex", justifyContent: "center" }}>
            {/*<h3>{t.stuff.nothing[language]}</h3>*/}
            <h3>Магазин находится на техническом обслуживании. Скоро вернемся.</h3>
        </div>
    )
};

export default OnMaintenance;