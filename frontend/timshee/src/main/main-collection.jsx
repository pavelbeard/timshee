import React from 'react';
import { Link } from "react-router-dom";

const MainCollection = ({ data }) => {
    return (
        <div className="flex flex-col items-center justify-center max-sm:p-4 lg:p-2">
            <Link to={`/shop/collections/${data ? data?.link : "alt"}`}
            className="flex flex-col items-center">
                <img
                    src={data?.collection_image}
                    className="hidden max-md:block max-md:h-[228px]"
                    alt="collection-img"
                />
                <img
                    src={data?.collection_image}
                    className="block max-md:hidden h-[500px]"
                    alt="collection-img"
                />
                <p className="pt-2">{data?.name}</p>
            </Link>
        </div>
    )
}

export default MainCollection;