import React from 'react';

import Loading from "./techPages/loading";
import {Link} from "react-router-dom";
import {clsx} from "clsx";

const Cards = ({ data }) => {
    return (
        <div className={clsx(
            "flex items-center justify-center p-6",
            data?.length > 3 &&
            'md:overflow-x-auto lg:overflow-x-auto'
        )}>
            <div className="flex max-md:flex-col">
                {
                    data ? data?.map((category, index) =>
                        <div className="flex-shrink-0 p-1" key={index}>
                            <Link to={`/shop/collections/${category.code}`} className="flex flex-col items-center">
                                <img
                                    src={category?.category_image}
                                    className="hidden max-md:block h-[200px] lg:w-full"
                                    alt={`alt-${index}`}
                                />
                                <img
                                    src={category?.category_image}
                                    className="max-md:hidden h-[328px]"
                                    alt={`alt-${index}`}
                                />
                                <p className="pt-2">{category.name}</p>
                            </Link>
                        </div>
                    ) : (
                        <Loading/>
                    )
                }
            </div>
        </div>
    )
}

export default Cards;