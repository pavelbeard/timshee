import React from 'react';
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import "./Shop.css";
import "./ItemCards.css";

const Colors = ( {colors, visibility}) => {
    return (
        <div className={visibility ? "item-colors visible" : "item-colors invisible"}>
            {colors.map((color, index) => {
                return (
                    <div key={index * 2} style={{
                        backgroundColor: color.hex,
                    }}></div>
                )
            })}
        </div>
    )
};

const Sizes = ({ sizes, visibility }) => {
    useEffect(() => {

    }, [visibility])

    return (
        <div className={visibility ? "item-sizes visible" : "item-sizes invisible"}>
            {sizes.map((size, index) => {
                return (
                    <div key={index * 3}>{size.value}</div>
                )
            })}
        </div>
    )
};


const ItemCards = ({items}) => {
    const [imageSize, setImageSize] = useState("");
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

    const setItemUrl = (item) => {
        const index = window.location.href.split('/').indexOf('g');
        let vPath;
        if (index > -1) {
            vPath = "g";
        } else {
            vPath = "c";
        }
        return `/shop/collections/${vPath}/${item.collection.link}/${item.type.name.replace(/ /g, "-").toLowerCase()}`
                    + `/${item.id}/${item.name.replace(/ /g, "-").toLowerCase()}`;
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setImageSize("300");
            } else if (width >= 768 && width < 845) {
                setImageSize("375");
            } else {
                setImageSize("512");
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="items-cards-container">
            {items?.map((item, index) => {
                return (
                    <div key={index}
                        onMouseEnter={() => {
                            setSelectedItemIndex(index);
                        }}
                        onMouseLeave={() => {
                            setSelectedItemIndex(-1)
                        }}
                        className="item-card">
                            <Link to={(setItemUrl(item))}>
                                <img src={item.image} alt="alt-item-image" height={imageSize}/>
                            </Link>
                            <div className="item-data">
                                <p>{item.name}</p>
                                <p>{item.price}</p>
                            </div>
                            <div className="item-data-hidden">
                                <Colors colors={item.colors} visibility={index === selectedItemIndex} />
                                <Sizes sizes={item.sizes} visibility={index === selectedItemIndex} />
                            </div>
                    </div>
                )
            })}
        </div>
    )
};

export default ItemCards;