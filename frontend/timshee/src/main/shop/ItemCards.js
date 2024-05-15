import React from 'react';
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setItemData} from "../../redux/slices/shopSlices/itemSlice";

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


const ItemCard = ({ item, imageSize }) => {
    const dispatch = useDispatch();
    const [visibility, setVisibility] = useState(false);

    const itemUrl = `/shop/${item.collection.link}/${item.type.name.replace(/ /g, "-").toLowerCase()}`
        + `/${item.name.replace(/ /g, "-").toLowerCase()}`;

    return (
        <div
            onMouseEnter={() => setVisibility(true)}
            onMouseLeave={() => setVisibility(false)}
            className="item-card"
        >
            <Link to={itemUrl} onClick={() => dispatch(setItemData({
                ...item
            }))}><img src={item.image} alt="alt-item-image" height={imageSize}/></Link>
            <div className="item-data">
                <p>{item.name}</p>
                <p>{item.price}</p>
            </div>
            <div className="item-data-hidden">
                <Colors colors={item.colors} visibility={visibility} />
                <Sizes sizes={item.sizes} visibility={visibility} />
            </div>
        </div>
    )
};

const ItemCards = ({items}) => {
    const [imageSize, setImageSize] = useState("");

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
                return <ItemCard item={item} key={index} imageSize={imageSize} inStock={item.in_stock}/>
            })}
        </div>
    )
};

export default ItemCards;