import React from 'react';
import {Link, useParams} from "react-router-dom";
import Image from "../ui/Image";
import ItemImage from "../ui/ItemImage";

const MainCollection = ({ data }) => {
    process.env.NODE_ENV !== 'production' && console.log(data)
    const { gender } = useParams();
    return (
        <div className="flex flex-col items-center justify-center p-4 lg:p-2">
            <Link to={`/${gender}/shop?collections=${data ? data?.link : "alt"}`}
            className="flex flex-col items-center">
                <ItemImage
                    src={data?.collection_image}
                    className="w-full lg:w-1/2"
                    alt="collection-img"
                />
                <p className="pt-2">{data?.name}</p>
            </Link>
        </div>
    )
}

export default MainCollection;