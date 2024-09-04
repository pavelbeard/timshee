import {clsx} from "clsx";
import {safeArrElAccess} from "../../lib/stuff";

export default function Modal({ open, close, children }) {
    const style = {
        base: 'fixed inset-0',
        forForms: 'flex justify-center items-center',
        forSideMenuLeft: 'w-full',
        forSideMenuRight: 'w-8/12'
    }
    const childrenName = safeArrElAccess(children, 2)?.type?.name;
    return(
        <div
            onClick={close}
            className={clsx(
                style.base,
                childrenName === 'VerticalHeader' && style.forSideMenuLeft,
                childrenName?.includes('Form') && style.forForms,
                childrenName?.includes('Cart') && style.forSideMenuRight,
            open ? 'visible bg-black/20' : 'invisible'
        )}>
            {children}
        </div>
    )
}