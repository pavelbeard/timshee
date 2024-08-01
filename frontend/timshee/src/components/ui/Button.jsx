import React from 'react';
import {clsx} from "clsx";

export default function Button ({ children, className, ...rest }) {
    const btn = clsx(
        'border-[1px] border-black flex items-center justify-center cursor-pointer',
        'tracking-widest py-3 mt-2',
        'hover:bg-black hover:text-white',
        'w-full'
    );
    return(
        <button
            {...rest}
            className={clsx(
                btn, className
            )}
            >{children}
        </button>
    );
}