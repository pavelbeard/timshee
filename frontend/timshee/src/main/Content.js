import React from 'react';
import {useEffect, useState} from "react";
import MainCollection from "./MainCollection";
import "./Content.css";
import Cards from "./Cards";
import {Outlet, useOutlet} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const Content = () => {
    const outlet = useOutlet();

    const [categories, setCategories] = useState(null);
    const [mainCollection, setMainCollection] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL + 'api/store/categories/');
            const json = await response.json();
            setCategories(json)
        } catch (error) {
            console.error("Error fetching data: ", error)
        }
    };

    const fetchMainCollection = async () => {
        try {
            const response = await fetch(API_URL + 'api/store/collections/');
            const json = await response.json();
            setMainCollection(json.pop())
        } catch (error) {
            console.error("Error fetching collection: ", error)
        }
    };

    useEffect(() => {
        fetchData();
        fetchMainCollection();
    }, []);


    return (
        <div className="content">
            {
                outlet || (
                    <>
                        <MainCollection data={mainCollection} />
                        <Cards data={categories} />
                    </>
                )
            }
        </div>
    )
}

export default Content;