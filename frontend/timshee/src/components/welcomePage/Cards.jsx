import React from 'react';

import Loading from "../../pages/Loading";
import {Link, useParams} from "react-router-dom";
import {clsx} from "clsx";
import Image from "../ui/Image";
import ItemImage from "../ui/ItemImage";

export default function Cards({ data=[] }) {
    const { gender } = useParams();
    return (
        <div className={clsx(
            "flex items-center justify-center p-6",
            data?.length > 3 &&
            'md:overflow-x-auto lg:overflow-x-auto'
        )}>
            <div className="lg:flex grid grid-cols-2 gap-2">
                {
                    Array.isArray(data) ? data?.map((category, index) =>
                        <div className="flex-shrink-0 p-1" key={index}>
                            <Link
                                to={`/${gender}/shop?categories=${category.code}`}
                                className="flex flex-col items-center"
                            >
                                <ItemImage
                                    // src={category[`category_image_${gender}`]}
                                    src={category[`category_image`]}
                                    className="lg:h-[400px] lg:w-full"
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