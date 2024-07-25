import React from 'react';
import {clsx} from "clsx";

const btn = clsx(
    'border-[1px] border-black flex items-center justify-center cursor-pointer',
    'tracking-widest py-3 mt-2',
    'hover:bg-black hover:text-white',
    'w-full'
);

export function Button ({ children, className, ...rest }) {
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