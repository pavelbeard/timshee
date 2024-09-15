import {clsx} from "clsx";
import {API_URL} from "../../../config";
import ImageSkeleton from "../../skeletons/ui/ImageSkeleton";
import React from "react";
import ItemImage from "../../ui/ItemImage";

export default function LastOrderOrderItem({ lastOrder }) {
    return (
        <div className={clsx(
            'flex max-sm:flex-col overflow-x-auto gap-2 mt-2'
        )}>
            {Array.isArray(lastOrder?.order_item)
                ? lastOrder.order_item.map((item, index) =>
                    <div
                        key={index}
                        className={clsx(
                            'flex-shrink-0 w-24 h-48',
                        )}>

                        <ItemImage
                            src={`${API_URL}/${item.item.item.image}`}
                            alt={`alt-img-${index}`}
                        />
                    </div>)
                :
                Array.from({length: 3}).map((_, index) =>
                    <div className={clsx(
                        'flex-shrink-0 w-24 h-48',
                        'max-sm:h-80'
                    )}>
                        <ImageSkeleton
                            key={index}
                            className={clsx('aspect-[3/5] bg-gray-300 object-cover mt-2')}
                        />
                    </div>
                )
            }
        </div>
    )
}