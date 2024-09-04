import {clsx} from "clsx";
import React from "react";

export default function CustomInput({
    className,
    labelClassName,
    htmlFor,
    labelText,
    ...rest
}) {
    return (
        <label
            htmlFor={htmlFor}
            className={clsx(
                'flex mb-3 relative',
                'flex-col items-start',
                labelClassName
            )}
        >
            <span className="text-gray-500 bg-white px-4 absolute -top-2 left-4">{labelText}</span>
            <input
                {...rest}
                id={htmlFor}
                className={
                    clsx(
                        'appearance-none outline-0',
                        'pr-5 py-4 pl-4 sometype-mono-regular text-[0.675rem]',
                        'border outline-2 outline-indigo-200 border-gray-200 w-full',
                        className
                    )
                }
            />
        </label>
    )
}