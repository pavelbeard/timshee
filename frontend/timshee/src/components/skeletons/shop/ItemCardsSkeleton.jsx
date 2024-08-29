import {clsx} from "clsx";
import ItemCardSkeleton from "./item-card-skeleton";

export default function ItemCardsSkeleton() {
    const itemsStyle = clsx(
        'grid grid-cols-2 gap-4 mx-6',
        'lg:grid-cols-3 lg:mx-24',
        'xl:mx-36'
    );
    return(
        <div className={itemsStyle} data-items-skeleton="">
            {Array.from({length: 9}).map((_, index) => (
                <ItemCardSkeleton key={index} />
            ))}
        </div>
    )
}