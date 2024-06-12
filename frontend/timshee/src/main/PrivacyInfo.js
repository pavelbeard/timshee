import React from "react";
import t from "./translate/TranslateService";

const PrivacyInfo = () => {
    const language = t.language();
    return (
        <div style={{ padding: "0 2rem 5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>
            {t.privacy.bigText[language]}
        </div>
    )
};

export default PrivacyInfo;