import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import "./ItemCard.css";
import arrowLeft from "../../media/static_images/arrow-left.svg";
import arrowRight from "../../media/static_images/arrow-right.svg";
import {checkInStock, getItemDetail, setHasAdded, setItemData} from "../../redux/slices/shopSlices/itemSlice";
import {useParams} from "react-router-dom";
import {resetIsAdded} from "../cart/reducers/cartSlice";
import {addCartItem} from "../cart/api/asyncThunks";

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
    const params = useParams();
    const {isValid} = useSelector((state) => state.auth);
    const {isAdded} = useSelector(state => state.cart);
    const {inStock} = useSelector(state => state.item);

    const {itemDetail: item} = useSelector(state => state.item);

    const [imageSize, setImageSize] = React.useState("");
    
    const [selectedSize, setSelectedSize] = React.useState();
    const [selectedColor, setSelectedColor] = React.useState();


    const changeSize = (e) => {
        const size = parseInt(e.target.value);
        setSelectedSize(size);
        dispatch(checkInStock({
            itemId: item.id, size: size, color: selectedColor
        }));
        dispatch(resetIsAdded());
    };

    const changeColor = (e) => {
        const color = parseInt(e.target.value);
        setSelectedColor(color);
        dispatch(checkInStock({
            itemId: item.id, size: selectedSize, color: color
        }));
        dispatch(resetIsAdded());
    };

    useEffect(() => {
        dispatch(getItemDetail({itemId: params.itemId}));
    }, []);


    useEffect(() => {
        if (item !== undefined) {
            if (item.sizes.length > 0 && item.colors.length > 0) {
                const size = item.sizes[0].id;
                const color = item.colors[0].id;
                dispatch(checkInStock({
                    itemId: params.itemId, size: size, color: color
                }));
                setSelectedSize(size);
                setSelectedColor(color);
            }
        }
    }, [item]);

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
        const data = {
            "item_id": item.id,
            "size_id": selectedSize,
            "color_id": selectedColor,
            "quantity": 1
        };
        dispatch(addCartItem({data, isAuthenticated: isValid}));
    };

    if (item !== undefined) {
        return (
            <div className="item-card-container">
                <div className="empty-space left"></div>
                <div className="item-card-content">
                    <Carousel images={item.carousel_images} imageSize={imageSize}/>
                    <div className="item-card-info">
                        <div className="item-name-price">
                            <div>{item.name}</div>
                            <div>{item.price}</div>
                        </div>
                        <div className="item-description"><pre>{item.description}</pre></div>
                        <div className="item-card-specs">
                            <div className="item-card-sizes">
                                <label htmlFor="sizes">
                                    <span>Sizes:</span>
                                </label>
                                <select id="sizes" value={selectedSize} onChange={changeSize}>
                                    {item.sizes.map((size) => (
                                        <option key={size.id} value={size.id}>{size.value}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="item-card-colors">
                                <label htmlFor="colors">
                                    <span>Colors:</span>
                                </label>
                                <select id="colors" value={selectedColor} onChange={changeColor}>
                                    {item.colors.map((color) => (
                                        <option key={color.id} value={color.id}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
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
    } else {
        return <div>Loading...</div>
    }
};

export default ItemCardDetail;