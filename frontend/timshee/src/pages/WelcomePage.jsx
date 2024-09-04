import React from 'react';
import MainCollection from "../components/welcomePage/MainCollection";
import Loading from "./Loading";
import Error from "./Error";
import Cards from "../components/welcomePage/Cards";
import {useSelector} from "react-redux";
import {safeArrElAccess} from "../lib/stuff";

const WelcomePage = () => {
    const { collections, categories, isLoading } = useSelector(s => s.store);
    process.env.NODE_ENV !== 'production' && console.log(collections)
    const data = safeArrElAccess(collections?.filter(c => c.show_in_welcome_page), 0);

    if (isLoading) {
        return <Loading />;
    } else if (collections || categories) {
        return (
            <div className="pt-0.5 min-h-[100vh]">
                <MainCollection data={data} />
                <Cards data={categories} />
            </div>
        )
    } else {
        return <Error />
    }
}

export default WelcomePage;