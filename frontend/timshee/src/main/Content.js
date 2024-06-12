import React from 'react';
import {useEffect, useState} from "react";
import MainCollection from "./MainCollection";
import "./Content.css";
import Cards from "./Cards";
import {Outlet, useOutlet} from "react-router-dom";
import {useSelector} from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const Content = () => {
    const outlet = useOutlet();

    const {categories, collections} = useSelector(state => state.app);

    return (
        <div className="content">
            {
                outlet || (
                    <>
                        <MainCollection data={collections[0]} />
                        <Cards data={categories} />
                    </>
                )
            }
        </div>
    )
}

export default Content;