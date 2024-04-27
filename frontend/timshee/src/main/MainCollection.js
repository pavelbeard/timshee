import React from 'react';
import {useEffect, useState} from "react";

import collectionImg from "../media/product_images/IMG_9781_hZFZGbl.JPG";
import "./MainCollection.css"
import {Link} from "react-router-dom";

const MainCollection = ({ data }) => {
    const [imageSize, setImageSize] = React.useState('');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setImageSize("200");
            } else if (width >= 768 && width < 1200) {
                setImageSize("300");
            } else {
                setImageSize("400");
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="collection-introduction">
            <img src={collectionImg} alt="collection-img" height={imageSize}/>
            <Link
                className="link-to-main-collection"
                to={`/collections/${data ? data.link : "alt"}`}
            >
                {data ? data.name : "alt"}
            </Link>
        </div>
    )
}

export default MainCollection;