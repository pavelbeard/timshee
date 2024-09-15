import {clsx} from "clsx";
import ImageSkeleton from "../../skeletons/ui/ImageSkeleton";
import React from "react";
import ItemImage from "../../ui/ItemImage";

export default function LastOrderReturnedItem({ lastOrder }) {
    return (
        <div className={clsx(
            'flex max-sm:flex-col overflow-x-auto gap-2 mt-2'
        )}>
            {Array.isArray(lastOrder?.returned_item)
                ? lastOrder.returned_item.map((item, index) =>
                    <div
                        key={index}
                        className={clsx(
                            'flex-shrink-0 w-24 h-48',
                        )}>
                        <ItemImage
                            src={`${item.item.item.image}`}
                            className={clsx(
                                "brightness-50",
                            )}
                            alt={`alt-img-${index}`}
                        />
                    </div>)
                :
                Array.from({length: 3}).map((_, index) =>
                    <div className={clsx(
                        'flex-shrink-0 w-20 h-40',
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