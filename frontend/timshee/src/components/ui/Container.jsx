import {clsx} from "clsx";

export default function Container({ className, children, ...rest }) {
    return(
        <div {...rest} className={clsx("min-h-screen overflow-y-auto mx-6 mb-3", className)}>
            {children}
        </div>
    )
}