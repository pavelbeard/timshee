import {createContext, useState} from "react";

export const ShopContext = createContext(null);

export default function ShopProvider({ children }) {
    const [collectionLinks, setCollectionLinks] = useState([]);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [types, setTypes] = useState([]);

    return (
        <ShopContext.Provider value={{
            collectionLinks, collections, categories, sizes, colors, types,
            setCollectionLinks, setCollections, setCategories, setSizes, setColors, setTypes
        }}>
            {children}
        </ShopContext.Provider>
    );
}