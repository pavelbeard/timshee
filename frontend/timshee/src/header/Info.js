import React from 'react';
import {useEffect} from "react";
import InfoList from "./InfoList";

import "../main/Main.css";
import "./Info.css";
import search from "../media/static_images/buscador.svg";
import {useDispatch} from "react-redux";
import {toggleSearch} from "../redux/slices/searchSlice";

const Info = () => {
    const dispatch = useDispatch();
    const [isWindowNotWide, setIsWindowNotWide] = React.useState(false);

    const clickSearch = () => {
        dispatch(toggleSearch());
    }

    useEffect(() => {
        const showSearch = () => {
            const width = window.innerWidth;
            setIsWindowNotWide(width <= 768);
        }

        showSearch();
        window.addEventListener("resize", showSearch);
        return () => window.removeEventListener("resize", showSearch);
    }, []);

    return (
        <nav className="nav nav-right">
            {
                isWindowNotWide ? (
                    <img src={search} alt="search" height={20} onClick={clickSearch} />
                ) : (
                    <InfoList />
                )
            }
        </nav>
    )
}

export default Info;