import React from "react";
import {clsx} from "clsx";
import ChangeEmailForm from "../../components/account/forms/ChangeEmailForm";
import {useAccountContext} from "../../lib/hooks";
import EmailBlock from "../../components/account/EmailBlock";
import EmailSkeleton from "../../components/account/skeletons/EmailSkeleton";
import LastOrder from "../../components/account/LastOrder";
import PrimaryAddress from "../../components/account/PrimaryAddress";


const Account = () => {
    const { isLoading, isChangeEmailFormOpened } = useAccountContext();
    const secondBlock = clsx(
        "items-center justify-items-center pb-[50px]",
        'max-sm:flex max-sm:flex-col',
        'lg:grid lg:grid-cols-2 lg:gap-x-1'
    );
    if (isChangeEmailFormOpened) {
        return <ChangeEmailForm />
    } else {
        return (
            <div className="min-h-[100vh] mx-6">
                {isLoading ? <EmailSkeleton /> : <EmailBlock />}
                <div className={secondBlock} data-second-block="">
                    <PrimaryAddress />
                    <LastOrder />
                </div>
            </div>
        )
    }
};

export default Account;