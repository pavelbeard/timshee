import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import "./ItemCard.css";
import arrowLeft from "../../media/static_images/arrow-left.svg";
import arrowRight from "../../media/static_images/arrow-right.svg";
import {checkInStock, getItemDetail} from "../../redux/slices/shopSlices/itemSlice";
import {useParams} from "react-router-dom";
import {resetAddCartItemStatus} from "../cart/reducers/cartSlice";
import {addCartItem, getCartItems} from "../cart/api/asyncThunks";
import AuthService from "../api/authService";
import {addToWishlist, deleteWishlistItem} from "../account/api/reducers/asyncThunks";
import Error from "../Error";
import {checkItemInWishList} from "../account/api/reducers/wishlistSlice";
import translateService from "../translate/TranslateService";

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
    const token = AuthService.getCurrentUser();
    const language = translateService.language();
    const {cart, getCartItemsStatus, addCartItemStatus} = useSelector(state => state.cart);
    const {inStock} = useSelector(state => state.item);
    const {wishlist, isItemInWishlist} = useSelector(state => state.wishlist);

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
        dispatch(resetAddCartItemStatus('idle'));
        dispatch(checkItemInWishList({itemId: item.id, size: size, color: selectedColor}));
    };

    const changeColor = (e) => {
        const color = parseInt(e.target.value);
        setSelectedColor(color);
        dispatch(checkInStock({
            itemId: item.id, size: selectedSize, color: color
        }));
        dispatch(resetAddCartItemStatus('idle'));
        dispatch(checkItemInWishList({itemId: item.id, size: selectedSize, color: color}));
    };

    useEffect(() => {
        if (getCartItemsStatus === "idle") {
            dispatch(getCartItems());
        }
    }, [getCartItemsStatus, cart.cartItems.length]);

    useEffect(() => {
        dispatch(getItemDetail({itemId: params.itemId}));
    }, []);

    useEffect(() => {

    }, [])

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
                dispatch(checkItemInWishList({itemId: item.id, size: size, color: color}));
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
    }, [inStock, addCartItemStatus]);

    const addToCart = () => {
        const data = {
            "item_id": item.id,
            "size_id": selectedSize,
            "color_id": selectedColor,
            "quantity": 1
        };
        dispatch(addCartItem({data, token}));
    };

    const handleWishlist = () => {
        const data = {
            stock: {
                item_id: params.itemId,
                size_id: selectedSize,
                color_id: selectedColor
            },
            stock_link: "/shop" + window.location.href.split("/shop")[1]
        }

        const item = wishlist.find(item =>
            item.stock.item?.id === parseInt(params.itemId) &&
            item.stock.size?.id === selectedSize &&
            item.stock.color?.id === selectedColor
        );

        if (item) {
            dispatch(deleteWishlistItem({token, wishlistItemId: item.id}));
        } else {
            dispatch(addToWishlist({token, data}));
        }
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
                                    <span>{translateService.itemCardDetail.sizes[language]}</span>
                                </label>
                                <select id="sizes" value={selectedSize} onChange={changeSize}>
                                    {item.sizes.map((size) => (
                                        <option key={size.id} value={size.id}>{size.value}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="item-card-colors">
                                <label htmlFor="colors">
                                    <span>{translateService.itemCardDetail.colors[language]}</span>
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
                            inStock === 0
                                ? <div className="add-button out-of-stock">{
                                    translateService.itemCardDetail.outOfStock[language]
                                }</div>
                                : addCartItemStatus === "success"
                                    ?
                                    <div className="add-button has-added">{
                                        translateService.itemCardDetail.hasAdded[language]
                                    }</div>
                                    :
                                    <div className="add-button add-to-cart.item-card" onClick={addToCart}>
                                        {translateService.itemCardDetail.addToCart[language]}
                                    </div>
                        }
                        <div className="add-button add-to-wishlist" onClick={handleWishlist}>
                            {isItemInWishlist
                                ? translateService.itemCardDetail.removeFromWishlist[language]
                                : translateService.itemCardDetail.addToWishlist[language]
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (getCartItemsStatus === "error") {
        return <Error />;
    }
};

export default ItemCardDetail;