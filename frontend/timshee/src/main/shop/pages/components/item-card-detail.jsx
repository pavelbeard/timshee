import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {checkInStock, getItemDetail} from "../../../../redux/slices/shopSlices/itemSlice";
import {useParams} from "react-router-dom";
import {resetAddCartItemStatus} from "../../../cart/reducers/cartSlice";
import {addCartItem, getCartItems} from "../../../cart/api/asyncThunks";
import AuthService from "../../../api/authService";
import {addToWishlist, deleteWishlistItem} from "../../../account/api/reducers/asyncThunks";
import Error from "../../../techPages/error";
import {checkItemInWishList} from "../../../account/api/reducers/wishlistSlice";
import translateService from "../../../translate/TranslateService";
import t from "../../../translate/TranslateService";
import NotFound from "../../../../not-found";

import { API_URL } from '../../../../config';
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid";
import {clsx} from "clsx";
import Image from "../../../../components/image";

const img = clsx(
    'max-sm:h-[256px]',
    'md:h-[320px]',
    'lg:h-[512px]',
);

const Carousel = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        const newIndex = currentImageIndex >= images.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };

    const prevImage = () => {
        const newIndex = currentImageIndex <= 0 ? images.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex)
    };

    const style = clsx(
        'text-gray-700 absolute z-10 cursor-pointer',
        'max-sm:w-4 max-sm:h-4',
        'md:w-6 md:h-6',
        'lg:w-8 lg:h-8',
    )

    return(
        <div className="flex justify-center items-center md:pb-2">
            <div className="relative flex items-center">
                <ArrowLeftIcon className={clsx(style, 'left-0')} onClick={prevImage} />
                <Image
                    src={`${API_URL}${images[currentImageIndex]?.image}`}
                    alt={`alt-img-${images[currentImageIndex]?.id || 1}`}
                    // className={img}
                />
                <ArrowRightIcon className={clsx(style, 'right-0')} onClick={nextImage} />
            </div>
        </div>
    )
};

const itemDetailContainerStyle = clsx(
    'justify-items-center',
    'xl:justify-items-stretch',
    'max-sm:flex max-sm:flex-col',
    'md:flex md:flex-col md:p-5',
    'lg:grid lg:grid-cols-2',
);

const itemInfo = clsx(
    'flex flex-col h-full',
    'max-sm:pt-2 max-sm:w-10/12',
    'xl:w-full xl:pr-[8.5rem]'
);

const itemNamePrice = clsx(
    'flex justify-between tracking-widest text-lg'
);

const itemDescription = clsx(
    'border-t-[1px] border-b-[1px] border-gray-400',
    'w-full h-[300px] pt-2',
);

const itemCardSpecs = clsx(
    'flex justify-between pt-2'
);

const btn = clsx(
    'border-[1px] border-black w-1/2 flex items-center justify-center',
    'tracking-widest py-3 mt-2',
);

const btnAvailable = clsx(
    'hover:bg-black hover:text-white',
    'cursor-pointer',
);

const btnUnavailable = clsx(
    'bg-gray-100 text-gray-600',
    'cursor-not-allowed',
);

const _addToWishlist = clsx(
    'underline underline-offset-2 pt-2 cursor-pointer',
    'max-sm:pb-6'
);

const sizes = clsx(
    'flex justify-center items-center',
    'lg:pr-36'
);


const ItemCardDetail = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const token = AuthService.getAccessToken();
    const language = translateService.language();
    const {cart, getCartItemsStatus, addCartItemStatus} = useSelector(state => state.cart);
    const {inStock, itemDetailStatus} = useSelector(state => state.item);
    const {wishlist, isItemInWishlist} = useSelector(state => state.wishlist);
    const {itemDetail: item} = useSelector(state => state.item);
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



    if (itemDetailStatus === 'success') {
        return (
            <>
                <div className={itemDetailContainerStyle}>
                    <Carousel images={item.carousel_images}/>
                    <div className="flex justify-center items-center">
                        <div className={itemInfo}>
                            <div className={itemNamePrice}>
                                <div>{item.name}</div>
                                <div>{item.price}
                                    <span>{t.shop.price[language]}</span></div>
                            </div>
                            <div className={itemDescription} >
                                <pre className="tracking-wide" style={{fontFamily: "Bebas Neue Cyrillic"}}>
                                    {item.description}
                                </pre>
                            </div>
                            <div className={itemCardSpecs}>
                                <div className={sizes}>
                                    <label htmlFor="sizes">
                                        <span>{translateService.itemCardDetail.sizes[language]}</span>
                                    </label>
                                    <select className="pl-2" id="sizes" value={selectedSize} onChange={changeSize}>
                                        {item.sizes.map((size) => (
                                            <option key={size.id} value={size.id}>{size.value}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-center items-center">
                                    <label htmlFor="colors">
                                        <span>{translateService.itemCardDetail.colors[language]}</span>
                                    </label>
                                    <select className="pl-2" id="colors" value={selectedColor} onChange={changeColor}>
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
                                    ? <div className={clsx(btn, btnUnavailable)}>{
                                        translateService.itemCardDetail.outOfStock[language]
                                    }</div>
                                    : addCartItemStatus === "success"
                                        ?
                                        <div className={clsx(btn, btnUnavailable)}>{
                                            translateService.itemCardDetail.hasAdded[language]
                                        }</div>
                                        :
                                        <div className={clsx(btn, btnAvailable)} onClick={addToCart}>
                                            {translateService.itemCardDetail.addToCart[language]}
                                        </div>
                            }
                            <div className={_addToWishlist} onClick={handleWishlist}>
                                {isItemInWishlist
                                    ? translateService.itemCardDetail.removeFromWishlist[language]
                                    : translateService.itemCardDetail.addToWishlist[language]
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else if (itemDetailStatus === 'error') {
        return <NotFound/>
    } else if (getCartItemsStatus === "error") {
        return <Error/>;
    }
};

export default ItemCardDetail;