import {clsx} from "clsx";
import React from "react";

export default function CustomCheckbox({ htmlFor, labelText, labelClassName, className, ...rest}) {
    return (
        <label
            htmlFor={htmlFor}
            className={clsx(labelClassName, 'relative flex justify-between items-center')}
        >
            <span className="">{labelText}</span>
            <input
                type="checkbox"
                id={htmlFor}
                {...rest}
                className={clsx(
                    className,
                    'flex-none',
                    'appearance-none',
                    'relative peer shrink-0 border size-4 mt-0.5',
                    'border-gray-400 hover:bg-gray-200 hover:border-none',
                )}
            />
            <svg
                className={clsx(
                    "size-4 mt-0.5",
                    "absolute right-0 hidden",
                    "pointer-events-none",
                    'hover:text-white',
                    'peer-checked:block stroke-black peer-checked:bg-gray-200'
                )}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </label>
    );
}