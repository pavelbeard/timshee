import React, {useEffect} from 'react';
import MainCollection from "./main-collection";
import Cards from "./cards";
import {useOutlet} from "react-router-dom";
import {useShopStore} from "../store";

const Content = () => {
    const outlet = useOutlet();
    const { categories, collections, getCategories, getCollections } = useShopStore();

    useEffect(() => {
        (async () => {
            await getCategories();
            await getCollections();
        })();
    }, []);

    return (
        <div className="pt-0.5 min-h-[100vh]">
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