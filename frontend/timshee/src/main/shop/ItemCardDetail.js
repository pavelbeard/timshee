import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import "./ItemCard.css";
import arrowLeft from "../../media/static_images/arrow-left.svg";
import arrowRight from "../../media/static_images/arrow-right.svg";
import {checkInStock, getQuantityOfCart, setHasAdded} from "../../redux/slices/shopSlices/itemSlice";
import {addCartItem, createCart, resetIsAdded} from "../../redux/slices/shopSlices/cartSlice";

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
            <img src={`${API_URL}${images[currentImageIndex]?.image}`} alt={`alt-img-${images[currentImageIndex]?.id || 1}`} height={imageSize} />
            <img src={arrowRight} className="next-image" alt="arrow-right" onClick={nextImage} height={10} />
        </div>
    )
};


const ItemCardDetail = () => {
    const dispatch = useDispatch();
    const {isValid} = useSelector((state) => state.auth);
    const {isCreated, isAdded} = useSelector(state => state.cart);
    const {inStock} = useSelector(state => state.item);

    const data = useSelector(state => state.item.data
        && JSON.parse(localStorage.getItem("item")));

    const [imageSize, setImageSize] = React.useState("");
    
    const [selectedSize, setSelectedSize] = React.useState();
    const [selectedColor, setSelectedColor] = React.useState();


    const changeSize = (e) => {
        setSelectedSize(e.target.value);
        dispatch(checkInStock({
            itemId: data.id, size: e.target.value, color: selectedColor
        }));
        dispatch(resetIsAdded());
    };

    const changeColor = (e) => {
        setSelectedColor(e.target.value);
        dispatch(checkInStock({
            itemId: data.id, size: selectedSize, color: e.target.value
        }));
        dispatch(resetIsAdded());
    };

    useEffect(() => {
        if (data.sizes.length > 0) {
            setSelectedSize(data.sizes[0].value);
        }

        if (data.colors.length > 0) {
            setSelectedColor(data.colors[0].name)
        }

        if (data.sizes.length > 0 && data.colors.length > 0) {
            dispatch(checkInStock({itemId: data.id, size: data.sizes[0].value, color: data.colors[0].name}));
        }
    }, []);

    useEffect(() => {
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
    }, [inStock, isAdded]);

    const addToCart = async () => {
        const chosenItem = JSON.parse(localStorage.getItem("selectedItem"));

        if (!(localStorage.getItem("cartId")))
            dispatch(createCart({isAuthenticated: isValid}));
        if (!(localStorage.getItem("anonCartId")))
            dispatch(createCart({isAuthenticated: isValid}));

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

        dispatch(addCartItem({
            data: json,
            isAuthenticated: isValid,
        }));
        dispatch(getQuantityOfCart({
            isAuthenticated: isValid,
        }));
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
                    <div className="item-card-specs">
                        <div className="item-card-sizes">
                            <label htmlFor="sizes">
                                <span>Sizes:</span>
                            </label>
                            <select id="sizes" value={selectedSize} onChange={changeSize}>
                                {data.sizes.map((size) => (
                                    <option key={size.id} value={size.value}>{size.value}</option>
                                ))}
                            </select>
                            {/*{data.sizes && data.sizes.map((size, index) => {*/}
                            {/*    return(*/}
                            {/*        <div*/}
                            {/*            key={size.id}*/}
                            {/*            data-size-value={size.value}*/}
                            {/*            className={chosenSize[index]?.chosen ? "chosen-size" : "" }*/}
                            {/*            onClick={() => {*/}
                            {/*                chooseSize(index)*/}
                            {/*                outOfStock({});*/}
                            {/*            }}*/}
                            {/*        >*/}
                            {/*            <div>{size.value}</div>*/}
                            {/*        </div>*/}
                            {/*    )*/}
                            {/*    })*/}
                            {/*}*/}
                        </div>
                        <div className="item-card-colors">
                            <label htmlFor="colors">
                                <span>Colors:</span>
                            </label>
                            <select id="colors" value={selectedColor} onChange={changeColor}>
                                {data.colors.map((color) => (
                                    <option key={color.id} value={color.name}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                            {/*{typeof inStock.map === "function" && inStock.map((item, index) => {*/}
                            {/*    return (*/}
                            {/*        <div*/}
                            {/*            key={item.id}*/}
                            {/*            style={{*/}
                            {/*                backgroundColor: item.color.hex,*/}
                            {/*            }}*/}
                            {/*            data-color-name={item.color.name}*/}
                            {/*            className={chosenColor[index]?.chosen ? "chosen-color" : ""}*/}
                            {/*            onClick={() => {*/}
                            {/*                chooseColorId(index)*/}
                            {/*                outOfStock({});*/}
                            {/*            }*/}
                            {/*        }*/}
                            {/*        >*/}
                            {/*        </div>*/}
                            {/*    )*/}
                            {/*})}*/}
                        </div>
                    </div>
                    {
                        !inStock
                            ? <div className="add-to-cart out-of-stock">Out of stock</div>
                            : isAdded
                                ?
                                <div className="add-to-cart has-added">
                                    has added
                                </div>
                                :
                                <div className="add-to-cart add-to-cart.item-card" onClick={addToCart}>
                                    Add to cart
                                </div>
                    }
                </div>
            </div>
        </div>
    )
};

export default ItemCardDetail;