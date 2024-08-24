import {clsx} from "clsx";
import React from "react";

export default function CustomRadioBtn({
    className,
    labelClassName,
    htmlFor,
    labelText,
    type,
    ...rest
}) {
    return (
        <label
            htmlFor={htmlFor}
            className={clsx(
                'flex mb-3',
                type === 'checkbox' ? 'flex justify-between' : 'flex-col items-start',
                labelClassName
            )}
        >
            <span className="pb-2">{labelText}</span>
            <input
                type={type}
                {...rest}
                id={htmlFor}
                className={
                    clsx(
                        'pr-5 sometype-mono-regular text-[0.675rem]',
                        type === 'checkbox' ? 'flex-none' : 'border-b border-gray-200 w-full',
                        className
                    )
                }
            />
        </label>
    )
}