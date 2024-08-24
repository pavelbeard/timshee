import {clsx} from "clsx";
import React from "react";

export default function Radio({ htmlFor, labelText, ...rest }) {
    return (
        <div className="flex relative items-center">
            <input
                type="radio"
                id={htmlFor}
                {...rest}
                className={clsx(
                    'flex-none appearance-none size-3 peer rounded-2xl border-[1px] border-gray-200',
                    (rest?.checked || rest?.defaultChecked) && 'bg-black'

                )}
            />
            <span className={clsx(
                'hidden peer-checked:block absolute left-1',
                'size-1 rounded-2xl peer-checked:bg-white pointer-events-none'
            )} />
            <label className="ml-2" htmlFor={htmlFor}>{labelText}</label>
        </div>
    )
}