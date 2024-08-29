import {clsx} from "clsx";

export default function SignFormContainer({ children }) {
    return (
        <div className={clsx('flex min-h-screen mt-3 justify-between')}>
            {children}
        </div>
    );
}