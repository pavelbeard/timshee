import {clsx} from "clsx";
import React from "react";

export default function Range({ htmlFor, labelText, ...rest}) {
    let v;
    if (parseInt(rest.value) === parseInt(rest.min))
        v = 0
    else
        v = rest.value;

    const percentage = (parseInt(v) / parseInt(rest.max)) * 100;
    return (
        <div className="flex relative items-center">
            <input
                type="range"
                id={htmlFor}
                {...rest}
                className={clsx(
                    'flex-none appearance-none h-4 z-20 bg-transparent w-full border-[1px] border-gray-200',
                )}
            />
            <span className={clsx(
                "absolute bg-gray-100 h-4 z-10",
            )} style={{ width: `${percentage}%`}}></span>
            <label className="ml-2" htmlFor={htmlFor}>{labelText}</label>
        </div>
    )
}