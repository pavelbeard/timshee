import {clsx} from "clsx";

export default function FiltersContainer({children}) {
    const filtersContainerStyle = clsx(
        'flex',
        'mx-6 my-2 justify-between',
        'max-sm:flex-col',
        'sm:flex-row sm:justify-items-center',
        'md:justify-between',
        'lg:justify-between',
    );
    return (
        <div className={filtersContainerStyle}>
            {children}
        </div>
    )
}