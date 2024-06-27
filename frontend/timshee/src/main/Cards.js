import React from 'react';
import {useEffect} from "react";

import "./Cards.css";
import Loading from "./techPages/Loading";
import {Link} from "react-router-dom";

const Cards = ({ data }) => {
    const [imageSize, setImageSize] = React.useState('');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setImageSize("256");
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
        <div className="cards-container">
            <div className="empty-space"></div>
            <div className={data?.length <= 3 ? "item-cards item-cards-for-lte-3" : "item-cards"}>
                {
                    data ? data?.map((category, index) =>
                        <div className="card" key={index}>
                            <img src={category?.category_image} alt={"alt" + index} height={imageSize}/>
                            <p>
                                <Link to={`/shop/collections/${category.code}`}>{category.name}</Link>
                            </p>
                        </div>
                    ) : (
                        <Loading />
                    )
                }
            </div>
            <div className="empty-space"></div>
        </div>
    )
}

export default Cards;