import React, {useEffect, useRef, useState} from "react";
import {clsx} from "clsx";

export default function ItemImage({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false);
    const hasLoaded = () => setLoaded(true);

    return (
        <div
            className={clsx(
                'img-container',
                'flex justify-center items-center',
                !loaded && 'bg-gray-400 blur transition opacity ease-in-out',
                className
            )}
             data-blur-container="">
            <img
                onLoad={hasLoaded}
                src={src}
                alt={alt}
                className={clsx(
                    'object-contain max-w-full max-h-full',
                    !loaded && 'opacity-0'
                )}
                loading="lazy"
            />
        </div>
    )
}