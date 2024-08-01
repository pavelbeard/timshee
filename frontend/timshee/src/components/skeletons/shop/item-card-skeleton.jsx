import {clsx} from "clsx";

// WIP

export default function ItemCardSkeleton() {
    const itemContainerSkeleton = clsx(
        // 'max-sm:w-20 max-sm:h-44 bg-gray-100 flex flex-col',
    );
    const imgSkeleton = clsx(
        'bg-gray-100',
        'max-sm:w-20 max-sm:h-44',
        'sm:w-32 sm:h-52',
        'w-[372px] h-[642px]',  // LG
    );
    const itemPropsSkeleton = clsx(
        'bg-gray-100 flex justify-between flex-col items-center w-full',
        // 'max-sm:',
        // 'sm:w-32 sm:h-6 sm:flex-col',
        // '',
        // 'w-[372px] h-[22px] ',  // LG
    );
    const propSkeleton = clsx(
        'ml-0.5 w-16 h-4 bg-gray-200'
    )
    return(
        <div className={itemContainerSkeleton}>
            <div className={imgSkeleton}></div>
            <div className={itemPropsSkeleton}>
                <div className={clsx(propSkeleton)}></div>
                <div className={clsx(propSkeleton)}></div>
            </div>
        </div>
    )
}