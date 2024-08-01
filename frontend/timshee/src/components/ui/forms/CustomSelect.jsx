import React from "react";
import {clsx} from "clsx";

export default function CustomSelect({
    className,
    containerClassName,
    labelClassName,
    selectClassName,
    htmlFor,
    labelText,
    type,
    children,
    ...rest
}) {
    return(
        <label className={containerClassName} htmlFor={htmlFor}>
            <span className={clsx(className, labelClassName)}>{labelText}</span>
            <select className={clsx(className, selectClassName)} {...rest} id={htmlFor}>
                {children}
            </select>
        </label>

    )
}