import {Link, useParams} from "react-router-dom";
import React from "react";
import {clsx} from "clsx";
import {useTranslation} from "react-i18next";
import ItemImage from "../ui/ItemImage";

export default function ItemCard({ item }) {
    const { gender } = useParams();
    const { t } = useTranslation();
    const itemContainer = clsx(
        'h-56 flex flex-col items-center',
        'md:h-80',
        'lg:h-96'
    );
    const itemPropsContainer = clsx(
        'h-6 w-full mt-1 flex justify-between',
    );
    return (
        <div className={itemContainer}>
            <Link
                className={'w-full'}
                to={`/${gender}/shop/products/${item?.id}?size=${item?.sizes?.at(0)?.value}&color=${item?.colors?.at(0)?.name}`}
            >
                <ItemImage
                    src={item.image}
                    alt="alt-item-image"
                    className={'h-48 md:h-72 lg:h-[22rem]'}
                />
            </Link>
            <div className={itemPropsContainer} data-item-props="">
                <p className="roboto-text-xs">{item?.name}</p>
                <p className="roboto-text-xs">{item?.price}
                    <span className="roboto-text-xs">{t('shop:price')}</span>
                </p>
            </div>
        </div>
    )
}