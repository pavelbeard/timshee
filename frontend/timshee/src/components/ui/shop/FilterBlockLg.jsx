import {useClickOutside} from "../../../lib/hooks";
import {useRef} from "react";
import {clsx} from "clsx";

export default function FilterBlockLg({ title, children }) {
    const dropDownRef = useRef(null);
    const [showDialog, toggleDialog] = useClickOutside(dropDownRef);
    return(
        <div ref={dropDownRef} className="lg:mr-6 lg:relative" data-filter-dropdown-container="true">
            <button
                className="group roboto-text tracking-wide"
                onClick={toggleDialog}
            >
                {title}
                <span className={clsx(
                    showDialog
                        ? 'block max-w-full h-[0.5px] bg-gray-400'
                        : "block max-w-0 group-hover:max-w-full transition-all duration-300 h-[0.5px] bg-black"
                )}>
                </span>
            </button>
            <div className={clsx(showDialog ? "lg:absolute" : 'hidden')}>
                {children}
            </div>
        </div>
    )
}