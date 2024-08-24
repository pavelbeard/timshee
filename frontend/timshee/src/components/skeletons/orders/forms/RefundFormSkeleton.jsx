import {clsx} from "clsx";

export default function RefundFormSkeleton(props) {
    return(
        <div className="mx-6 mb-3 flex h-[800px] flex-col" data-refund-form-skeleton-container="">
            <div className={clsx(
                'flex w-48 max-sm:w-full h-6 bg-gray-300 items-center justify-start mb-3',
            )}>
            </div>
            <div className="flex flex-col lg:items-center">
                <div className="p-6 bg-gray-300 h-[650px] lg:w-1/2"></div>
            </div>
        </div>
    )
}