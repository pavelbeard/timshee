import {clsx} from "clsx";

export default function Overlay({ children, ...props }) {
    const { isCartMenuOpen, isBurgerMenuOpen, isFiltersMenuOpen } = props;
    const position = clsx(
        isCartMenuOpen && 'left-0',
        isBurgerMenuOpen && 'right-0',
    );
    const bg = clsx(
        'w-[51%] min-h-[100vh] absolute bg-gray-500 opacity-30 z-[100]',
        position
    );

    return(
        <div className={clsx(
            (isBurgerMenuOpen || isCartMenuOpen) && 'absolute flex w-full top-0 left-0 min-h-full z-0',
        )}>
            {isCartMenuOpen && <>
                <div className={clsx(isCartMenuOpen && bg)}></div>
                {children}
            </>}
            {(isBurgerMenuOpen || isFiltersMenuOpen) && <>
                {children}
                <div className={clsx(isBurgerMenuOpen && bg)}></div>
            </>}
        </div>
    )
}