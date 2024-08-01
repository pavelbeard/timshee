import React, {useEffect} from 'react';
import MainCollection from "./MainCollection";
import {useOutlet} from "react-router-dom";
import {useShopStore} from "../../store";
import {useQuery} from "react-query";
import {getCategories, getCollections} from "../../lib/shop";
import Loading from "../../pages/Loading";
import Error from "../../pages/Error";
import Cards from "./Cards";

const Content = () => {
    const outlet = useOutlet();
    const { isLoading, data, error } = useQuery({
        queryKey: ['mainContent'],
        queryFn: async () => {
            const [categories, collections] = await Promise.all([
                getCategories(),
                getCollections()
            ]);

            return { categories, collections }
        }
    })

    if (isLoading) {
        return <Loading />;
    } else if (data) {
        return (
            <div className="pt-0.5 min-h-[100vh]">
                {
                    outlet || <>
                        <MainCollection data={data?.collections?.at(0)} />
                        <Cards data={data?.categories} />
                    </>
                }
            </div>
        )
    } else {
        return <Error />
    }


}

export default Content;