import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";

import "./ItemCard.css";
import testImage from "../../media/static_images/B0011883-FA342-099-20240112110000_3_800x.jpg";
import arrowLeft from "../../media/static_images/arrow-left.svg";
import arrowRight from "../../media/static_images/arrow-right.svg";
import {addItem, createCart} from "./cartLogic";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const Carousel = ({ images, imageSize }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        const newIndex = currentImageIndex >= images.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };

    const prevImage = () => {
        const newIndex = currentImageIndex <= 0 ? images.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex)
    };

    return(
        <div className="img-container" style={{ height: `${imageSize}px`}}>
            <img src={arrowLeft} className="prev-image" alt="arrow-left" onClick={prevImage} height={10} />
            <img src={images[currentImageIndex]?.image || testImage} alt={`alt-img-${images[currentImageIndex]?.id || 1}`} height={imageSize} />
            <img src={arrowRight} className="next-image" alt="arrow-right" onClick={nextImage} height={10} />
        </div>
    )
};


const ItemCard = () => {
    const {isValid} = useSelector((state) => state.auth);
    const data = useSelector(state => state.item.data && JSON.parse(localStorage.getItem("item")));
    const [imageSize, setImageSize] = React.useState("");
    const [chosenSize, setChosenSize] = React.useState(
        data.sizes.map((size, index) => (index === 0
        ? {sizeId: index, sizeValue: size.value, chosen: true}
        : {sizeId: index, sizeValue: size.value, chosen: false}
        )));
    const [chosenColor, setChosenColor] = React.useState([]);
    const [stockItemChars, setStockItemChars] = React.useState([]);
    const [inStock, setInStock] = React.useState([]);
    const [hasAdded, setHasAdded] = React.useState(false);

    const showItemsInStock = (stock) => {
        const currentSize = chosenSize.filter(s => s.chosen === true)[0].sizeValue;
        const stockItems = stock || stockItemChars;
        const toShow = stockItems.filter(
            item => item.size.value === currentSize
        );

        if (toShow) {
            // when stockItems are putting in "inStock" setChosenColor also is setting up.
            setChosenColor(toShow.map((item, index) => {
                return index === 0
                    ? {colorId: index, colorName: item.color.name, chosen: true}
                    : {colorId: index, colorName: item.color.name, chosen: false}
            }))
            setInStock(toShow);
        }
    };

    const chooseSize = (index) => {
        setChosenSize(prevState =>
            prevState.map(i =>
                i.sizeId === index ? {...i, chosen: true} : {...i, chosen: false}
            ));
        setHasAdded(false);
    };

    const chooseColorId = (index) => {
        setChosenColor(prevState =>
            prevState.map(i =>
            i.colorId === index ? {...i, chosen: true} : {...i, chosen: false}
        ));
        setHasAdded(false);
    };

    const getStockItems = async (itemName) => {
        try {
            const url = [API_URL, "api/store/stocks/?", `&item__name=${itemName}`].join("");
            const response = await fetch(encodeURI(url), {
                method: "GET",
                credentials: "include",
            });
            const json = await response.json();

            showItemsInStock(json);
            setStockItemChars(json);

        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        if (stockItemChars.length === 0) {
            getStockItems(data.name);
        }

        showItemsInStock();

        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setImageSize("375");
            } else if (width >= 768 && width < 845) {
                setImageSize("375");
            } else {
                setImageSize("512");
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [chosenSize]);

    const addToCart = async () => {
        const chosenItem = inStock.filter(
            i => i.color.name === chosenColor.filter(i => i.chosen === true)[0].colorName
            && i.size.value === chosenSize.filter(i => i.chosen === true)[0].sizeValue
        )[0];

        if (!(localStorage.getItem("cartId") || localStorage.getItem("anonCartId")))
            await createCart(isValid);

        let json;

        if (isValid) {
            json = {
                "quantity_in_cart": 1,
                "cart": localStorage.getItem("cartId"),
                "stock": chosenItem.id,
            }
        } else {
            json = {
                "quantity_in_cart": 1,
                "anon_cart": localStorage.getItem("anonCartId"),
                "stock": chosenItem.id,
            }
        }

        if (await addItem({data: json, authorized: isValid})) {
            setHasAdded(true);
        }
    };

    return (
        <div className="item-card-container">
            <div className="empty-space left"></div>
            <div className="item-card-content">
                <Carousel images={data.carousel_images} imageSize={imageSize}/>
                <div className="item-card-info">
                    <div className="item-name-price">
                        <div>{data.name}</div>
                        <div>{data.price}</div>
                    </div>
                    <div className="item-description"><pre>{data.description}</pre></div>
                    <div className="item-card-sizes">
                        {data.sizes && data.sizes.map((size, index) => {
                            return(
                                <div
                                    key={size.id}
                                    data-size-value={size.value}
                                    className={chosenSize[index]?.chosen ? "chosen-size" : "" }
                                    onClick={() => chooseSize(index)}
                                >
                                    <div>{size.value}</div>
                                </div>
                            )
                        })
                    }</div>
                    <div className="item-card-colors">
                        {typeof inStock.map === "function" && inStock.map((item, index) => {
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: item.color.hex,
                                    }}
                                    data-color-name={item.color.name}
                                    className={chosenColor[index]?.chosen ? "chosen-color" : ""}
                                    onClick={() => chooseColorId(index)}
                                >
                                </div>
                            )
                        })}
                    </div>
                    {
                        hasAdded
                            ? <div className="add-to-cart has-added">has added</div>
                            : <div className="add-to-cart add-to-cart.item-card" onClick={addToCart}>Add to cart</div>
                    }
                </div>
            </div>
        </div>
    )
};

export default ItemCard;