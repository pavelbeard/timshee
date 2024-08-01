import React from 'react';
import {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {clsx} from "clsx";
import Color from "../ui/Color";
import Size from "../ui/Size";
import {useShopStore} from "../../store";
import {useTranslation} from "react-i18next";
import {useItemUrl, useWindowSize} from "../../lib/hooks";
import ItemCardSkeleton from "../skeletons/shop/item-card-skeleton";
import {shallow} from "zustand/shallow";

export default function ItemCards(props) {
    const params = useParams();
    const { itemsObject } = props;
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const { genders, collections, categories } = useShopStore(s => ({
        genders: s.genders, collections: s.collections, categories: s.categories
    }), shallow);
    const setItemUrl = useItemUrl();
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    // STYLES
    const itemsStyle = clsx(
        'mx-32 justify-items-center grid grid-cols-3 gap-6',
        'max-sm:grid max-sm:grid-cols-2 max-sm:items-center max-sm:gap-2 max-sm:mx-6',
        'sm:grid sm:grid-cols-2 sm:items-center sm:gap-4 sm:mx-16',
        'md:grid md:grid-cols-3 md:items-center md:gap-4 md:mx-16 md:mt-2',
        'lg:grid lg:grid-cols-3 lg:mx-32',
    );
    const itemContainerStyle = clsx(

    );
    const imageStyle = clsx(
        'aspect-[3/5] object-cover',
        // 'max-sm:w-20 max-sm:h-44',
        // 'max-sm:max-w-32 max-sm:max-h-52',
        // 'sm:w-32 sm:h-52',
        // 'sm:h-40',
        // 'md:h-[256px]',
        // 'lg:h-[320px]',
    );
    const itemProps = clsx(
        'roboto-light text-xs'
    );
    const itemPropsContainer = clsx(
        'flex justify-between items-center w-full max-sm:flex-col',
        // 'max-sm:w-32 max-sm:h-6 ',
    );
    return (
        <div className={clsx(itemsStyle)} data-items="">
            {Array.isArray(itemsObject?.items) && itemsObject.items?.map((item, index) => {
                return (
                    <div key={index}
                        className={itemContainerStyle}
                        onMouseEnter={() => setSelectedItemIndex(index)}
                        onMouseLeave={() => setSelectedItemIndex(-1)}
                    >
                        {/*<ItemCardSkeleton key={index}/>*/}
                        <Link to={(setItemUrl(item))}>
                            <img
                                src={item.image}
                                alt="alt-item-image"
                                className={imageStyle}
                            />
                        </Link>
                        <div className={itemPropsContainer} data-item-props="">
                            <p className={itemProps}>{item.name}</p>
                            <p className={itemProps}>{item.price}
                                <span className={itemProps}>
                                    {t('shop:price')}
                                </span>
                            </p>
                        </div>
                            {/*<div className="flex justify-between w-full">*/}
                            {/*    <Colors colors={item.colors} visibility={index === selectedItemIndex} />*/}
                            {/*    <Sizes sizes={item.sizes} visibility={index === selectedItemIndex} />*/}
                            {/*</div>*/}
                    </div>
                )

            })}
        {/*    : Array.from({length: 9}).map((_, index) =>
                <></>
                // WIP
                // <ItemCardSkeleton key={index}/>
                // <></>
            )*/}
        </div>
    )
};

const Colors = ( {colors, visibility}) => {
    return (
        <div className={clsx(visibility ? "flex items-center" : "hidden")}>
            {colors.map((color, index) => <Color key={index} hex={color.hex} />)}
        </div>
    )
};

const Sizes = ({ sizes, visibility }) => {
    return (
        <div className={clsx(visibility ? "flex items-center" : "hidden")}>
            {sizes.map((size, index) => <Size key={index} value={size.value} />)}
        </div>
    )
};