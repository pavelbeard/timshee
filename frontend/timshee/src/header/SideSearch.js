import React from 'react';
import {useDispatch} from "react-redux";
import {toggleSearch} from "../redux/slices/searchSlice";

import "./SideBars.css";
import search from "../media/static_images/buscador.svg";
import close from "../media/static_images/cruz.svg";
const SideSearch = () => {
    // Here is going to be some search function
    //
    const dispatch = useDispatch();

    const closeSearch = () => {
        dispatch(toggleSearch());
    }

    return (
        <div className="overlay overlay-1">
            <div className="search-bar">
                <img src={search} alt="search" height={20} />
                <input id="search-bar" type="search" placeholder="Buscador..." />
                <img src={close} alt="close-search" height={20} onClick={closeSearch} />
            </div>
        </div>
    )
};

export default SideSearch;