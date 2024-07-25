import React from 'react';
import {clsx} from "clsx";

const img = clsx(
    'max-sm:h-[256px]',
    'md:h-[320px]',
    'lg:h-[512px]',
);

export default function Image({ src, alt, imgClassName, ...rest }) {
    return <img src={src} alt={src} className={clsx(img, imgClassName)} {...rest} />;
}