import {createContext} from "react";

export const FilterContext = createContext(null);

export default function FilterProvider({ children }) {
    const orderBy = [
        {value: "", name: "---"},
        {value: "price", name: "ascending"},
        {value: "-price", name: "descending"},
    ];
    const genders = [
        { gender: "F", value: "women" },
        { gender: "M", value: "men" },
        { gender: "U", value: "unisex" }
    ];

    return(
        <FilterContext.Provider value={{ orderBy, genders }}>
            {children}
        </FilterContext.Provider>
    )
};