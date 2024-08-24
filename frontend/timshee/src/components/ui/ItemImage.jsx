import React, {useEffect, useRef, useState} from "react";
import {clsx} from "clsx";

export default function ItemImage({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false);
    const imageRef = useRef(null);
    const hasLoaded = () => setLoaded(true);

    useEffect(() => {
        if (imageRef.current) {
            imageRef.current.addEventListener('load', hasLoaded);
            return () => imageRef?.current?.removeEventListener('load', hasLoaded);
        }
    }, [imageRef]);

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
                ref={imageRef}
                src={src}
                alt={alt}
                className={clsx('object-contain max-w-full max-h-full', !loaded && 'opacity-0')}
                loading="lazy"
            />
        </div>
    )
}