import {clsx} from "clsx";
import Image from "../../ui/Image";
import {API_URL} from "../../../config";
import React from "react";
import ItemImage from "../../ui/ItemImage";

export default function ReturnedItemImages({ order }) {
    return (
        <div className={clsx('flex overflow-x-auto gap-2 mt-2')} data-order-item-returned="">
            {order?.returned_item.map((item, index) => (
                <div key={index} className={clsx(
                    'flex-shrink-0 w-24 h-48'
                )}>
                    <ItemImage
                        className={clsx(
                            item.refund_reason !== null && 'brightness-50',
                        )}
                        src={`${API_URL}${item.item.item.image}`}
                        alt={`alt-img-${index}`}
                    />
                </div>
            ))}
        </div>
    )
}