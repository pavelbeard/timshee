import {clsx} from "clsx";
import Image from "../../ui/Image";
import {API_URL} from "../../../config";
import React from "react";

export default function ReturnedItemImages({ order }) {
    return (
        <div className={clsx('flex overflow-x-auto gap-2 mt-2')} data-order-items="">
            {order.returned_item.map((item, index) => (
                <div key={index} className={clsx(
                    'flex-shrink-0 w-20 h-40'
                )}>
                    <Image
                        className={clsx(
                            item.refund_reason !== null && 'brightness-50',
                            'aspect-[3/5] object-cover',
                        )}
                        src={`${API_URL}${item.item.item.image}`}
                        alt={`alt-img-${index}`}/>
                </div>
            ))}
        </div>
    )
}