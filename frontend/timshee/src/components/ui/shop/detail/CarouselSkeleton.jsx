import {clsx} from "clsx";
import React from "react";

export default function CarouselSkeleton() {
    const style = clsx(
        'group',
        'absolute z-10',
        'size-8',
        'lg:size-10',
        'hover:text-gray-200',
    );

    return(
        <div className="flex justify-center items-center">
            <div className="relative flex items-center">
                <button className={clsx(style, 'left-2')}>
                </button>
                <div className="img-container lg:h-[450px]">
                </div>
                <button className={clsx(style, 'right-2')} >
                </button>
            </div>
        </div>
    )
}