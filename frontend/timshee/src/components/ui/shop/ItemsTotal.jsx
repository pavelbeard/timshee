import {useShopStore} from "../../../store";
import React from "react";

export default function ItemsTotal({...rest}) {
    const { itemsObject } = useShopStore();
    return (
        <div {...rest}>{itemsObject?.totalItemsCount}</div>
    )
}