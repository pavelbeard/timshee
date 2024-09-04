import {clsx} from "clsx";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/16/solid";
import React, {useState} from "react";

export default function CustomPassword({htmlFor, labelClassName, className, labelText, ...rest }) {
    const passwordEyeStyle = clsx(
        "size-4 absolute right-1 top-3.5 transform translate-y-[10%] cursor-pointer"
    );
    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    return (
        <label
            htmlFor={htmlFor}
            className={clsx(labelClassName, 'top flex mb-3 relative flex-col items-start',)}
        >
            <span className="text-gray-500 bg-white px-4 absolute -top-2 left-4">{labelText}</span>
            <input
                type={isPasswordRevealed ? 'text' : 'password'}
                {...rest}
                id={htmlFor}
                className={clsx('appearance-none outline-0',
                        'pr-5 py-4 pl-4 outline-2 outline-indigo-200 sometype-mono-regular text-[0.675rem]',
                        'border border-gray-200 w-full',
                        className)}
            />
            {isPasswordRevealed
                ? <EyeSlashIcon className={passwordEyeStyle} onClick={() => setIsPasswordRevealed(false)}/>
                : <EyeIcon className={passwordEyeStyle} onClick={() => setIsPasswordRevealed(true)}/>}
        </label>
    );
}