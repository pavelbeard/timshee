import {clsx} from "clsx";

export default function Divider() {
    const divider = clsx(
        'bg-gray-300 mb-2 h-[0.0825rem]',
    );
    return(
        <div className={divider}></div>
    )
}