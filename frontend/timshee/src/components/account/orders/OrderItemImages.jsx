import {clsx} from "clsx";
import React from "react";
import ItemImage from "../../ui/ItemImage";

export default function OrderItemImages({ order }) {
    return (
        <div className={clsx('flex overflow-x-auto gap-2 mt-2')} data-order-item="">
            {order.order_item.map((item, index) => (
                <div key={index} className={clsx(
                    'flex-shrink-0 w-24 h-48'
                )}>
                    <ItemImage
                        src={`${item.item.item.image}`}
                        alt={`alt-img-${index}`}
                    />
                </div>
            ))}
        </div>
    )
}