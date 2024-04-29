import React from 'react';
import {useEffect} from "react";

import "./Cards.css";

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
                    data ? data?.map((item, index) =>
                        <div className="card" key={index}>
                            <img src={item?.category_image} alt={"alt" + index} height={imageSize}/>
                            <p>{item.name}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )
                }
            </div>
            <div className="empty-space"></div>
        </div>
    )
}

export default Cards;