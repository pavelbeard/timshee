import React, {useState} from 'react';
import {clsx} from "clsx";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/16/solid";


const passwordEyeStyle = clsx(
    "w-4 h-4 absolute right-0 top-0 transform translate-y-[10%] cursor-pointer"
);

export default function CustomInput({
    className,
    labelClassName,
    htmlFor,
    labelText,
    type,
    ...rest
}) {
    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const withEye = (
        <div className={clsx(
            'w-full relative ',
        )}>
            <input
                type={type === 'password' ? isPasswordRevealed ? 'text' : type : type}
                {...rest}
                className={
                    clsx(
                        'pr-5 sometype-mono-regular text-[0.675rem]',
                        type === 'checkbox' ? 'flex-none' : 'border-b border-gray-200 w-full',
                        className
                    )
                }
                id={htmlFor}
            />
            {isPasswordRevealed ? (
                <EyeSlashIcon className={passwordEyeStyle} onClick={() => setIsPasswordRevealed(false)} />
            ) : (
                <EyeIcon className={passwordEyeStyle} onClick={() => setIsPasswordRevealed(true)}/>
            )}
        </div>
    );

    const withoutEye = (
        <input
            type={type}
            {...rest}
            className={
                clsx(
                    'pr-5 sometype-mono-regular text-[0.675rem]',
                    type === 'checkbox' ? 'flex-none' : 'border-b border-gray-200 w-full',
                    className
                )
            }
            id={htmlFor}
        />
    );

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
            {type === 'password' ? withEye : withoutEye}
        </label>
    );
}

