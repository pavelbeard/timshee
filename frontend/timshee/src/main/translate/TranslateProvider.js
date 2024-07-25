import React, {createContext, useEffect, useState} from "react";
import t from "./TranslateService";

const TranslateContext = createContext();

export const TranslateProvider = ({ children }) => {
    const [language, setLanguage] = useState(t.language());

    useEffect(() => {
        const language = t.language();
        setLanguage(language);
    }, []);

    const getLanguage = async () => {
        const result = await t.getLanguage();
        if (result) {
            setLanguage(result);
        } else {
            setLanguage("en-US");
        }
        window.location.reload();
    };

    const postLanguage = async (language) => {
        const result = await t.setLanguage(language);
        if (result) {
            setLanguage(result);
        } else {
            setLanguage("en-US");
        }
        window.location.reload();
    };

    return (
        <TranslateContext.Provider value={{getLanguage, postLanguage, language}}>
            {children}
        </TranslateContext.Provider>
    )
};

export default TranslateContext;