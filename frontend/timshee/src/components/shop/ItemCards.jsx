import React, {useMemo} from 'react';
import {clsx} from "clsx";
import ItemCard from "./ItemCard";

export default function ItemCards(props) {
    const { itemsObject } = props;
    // STYLES
    const itemsStyle = useMemo(() => clsx(
        'grid grid-cols-2 gap-4 mx-10 my-4',
        'lg:grid-cols-3 lg:mx-24',
        'xl:mx-36'
    ), []);

    const items = useMemo(() => itemsObject?.items?.map((item) => (
        <ItemCard key={item.id} item={item} />
    )), [itemsObject?.items]);
    return (
        <div className={clsx(itemsStyle)} data-items="">
            {items}
        </div>
    )
};