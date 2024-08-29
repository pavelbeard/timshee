import {clsx} from "clsx";

export default function BlockContainer({ children, ...rest }) {
    const blocksContainer = clsx(
        'flex flex-col justify-items-start h-full w-full',
        'max-sm:pb-2',
        'sm:pb-2'
    );
    return(
        <div className={blocksContainer} {...rest}>
            {children}
        </div>
    )
}