import {useEffect, useState} from "react";

import "./Shop.css";
import "./ItemCards.css";
import testImg from "../../media/static_images/B0011883-FA342-099-20240112110000_3_800x.jpg"

const Colors = ( {item, visibility}) => {
    return (
        <div className={visibility ? "item-colors visible" : "item-colors invisible"}>
            {item.colors.map((color, index) => {
                return (
                    <div key={index * 2} style={{
                        backgroundColor: color.hex,
                        width: "10px",
                        height: "10px",
                    }}></div>
                )
            })}
        </div>
    )
};

const Sizes = ({ item, visibility }) => {
    useEffect(() => {

    }, [visibility])

    return (
        <div className={visibility ? "item-sizes visible" : "item-sizes invisible"}>
            {item.sizes.map((size, index) => {
                return (
                    <div key={index * 3}>{size.value}</div>
                )
            })}
        </div>
    )
};


const ItemCard = ({ item, imageSize }) => {
    const [visibility, setVisibility] = useState(false);

    return (
        <div
            onMouseEnter={() => setVisibility(true)}
            onMouseLeave={() => setVisibility(false)}
            className="item-card"
        >
            <img src={item.image && testImg} alt="alt-item-image" height={imageSize}/>
            <div className="item-data">
                <p>{item.name}</p>
                <p>{item.price}</p>
            </div>
            <div className="item-data-hidden">
                <div className="add-to-cart">Add to cart</div>
                <Colors item={item} visibility={visibility} />
                <Sizes item={item} visibility={visibility} />
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
                return <ItemCard item={item} key={index} imageSize={imageSize}/>
            })}
        </div>
    )
};

export default ItemCards;