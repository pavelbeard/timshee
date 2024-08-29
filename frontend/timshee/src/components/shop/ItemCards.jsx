import React from 'react';
import {clsx} from "clsx";
import ItemCard from "./ItemCard";

export default function ItemCards(props) {
    const { itemsObject } = props;
    // STYLES
    const itemsStyle = clsx(
        'grid grid-cols-2 gap-4 mx-10 my-4',
        'lg:grid-cols-3 lg:mx-24',
        'xl:mx-36'
    );
    const items = Array.isArray(itemsObject?.items) && itemsObject.items?.map((item, index) => (
        <ItemCard key={index} item={item} />
    ));
    return (
        <div className={clsx(itemsStyle)} data-items="">
            {items}
        </div>
    )
};