import React from 'react';
import MainCollection from "../components/welcomePage/MainCollection";
import Loading from "./Loading";
import Error from "./Error";
import Cards from "../components/welcomePage/Cards";
import {useSelector} from "react-redux";

const WelcomePage = () => {
    const { collections, categories, isLoading } = useSelector(s => s.store);

    if (isLoading) {
        return <Loading />;
    } else if (collections || categories) {
        return (
            <div className="pt-0.5 min-h-[100vh]">
                <MainCollection data={collections?.filter(c => c.show_in_welcome_page)?.at(0)} />
                <Cards data={categories} />
            </div>
        )
    } else {
        return <Error />
    }
}

export default WelcomePage;