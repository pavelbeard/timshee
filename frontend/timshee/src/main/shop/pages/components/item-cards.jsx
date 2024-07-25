import React from 'react';
import {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {clsx} from "clsx";
import Color from "../../../../components/color";
import Size from "../../../../components/size";
import {useShopStore} from "../../../../store";
import {useTranslation} from "react-i18next";
import {useWindowSize} from "../../../../lib/hooks";

export default function ItemCards(props) {
    const params = useParams();
    const { itemsObject } = props;
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const { genders, collections, categories } = useShopStore();
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
        // 'h-[20rem]'
    );
    const imageStyle = clsx(
        'aspect-[3/5] object-cover',
        // 'sm:h-40',
        // 'md:h-[256px]',
        // 'lg:h-[320px]',
    );
    const itemProps = clsx(
        'roboto-light text-xs'
    );
    const itemPropsContainer = clsx(
        'flex justify-between w-full',
        'max-sm:flex-col',
    );

    const setItemUrl = (item) => {
        const g = genders.find(i => i.gender === item.gender);
        const gender = params.c.split('+').includes(g.value)
            ? "" : `${g.value}+`;
        const c = collections.find(i => i.link === item.collection.link);
        const collection = params.c.split('+').includes(c.link)
            ? "" : `${c.link}+`;
        return `/shop/collections/${gender}${collection}${params.c}/${item.type.name.replace(/ /g, "-").toLowerCase()}`
                    + `/${item.id}/${item.name.replace(/ /g, "-").toLowerCase()}`;
    };

    return (
        <div className={clsx(itemsStyle)} data-items="">
            {Array.isArray(itemsObject?.items) && itemsObject.items?.map((item, index) => {
                return (
                    <div key={index}
                        onMouseEnter={() => setSelectedItemIndex(index)}
                        onMouseLeave={() => setSelectedItemIndex(-1)}
                        className={itemContainerStyle}
                    >
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