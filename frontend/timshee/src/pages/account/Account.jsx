import React from "react";
import {clsx} from "clsx";
import EmailBlock from "../../components/account/EmailBlock";
import EmailSkeleton from "../../components/account/skeletons/EmailSkeleton";
import LastOrder from "../../components/account/LastOrder";
import PrimaryAddress from "../../components/account/PrimaryAddress";
import {useSelector} from "react-redux";
import {
    useGetAddressesByUserQuery,
    useGetOrdersByUserQuery,
} from "../../redux/features/api/accountApiSlice";
import PrimaryAddressSkeleton from "../../components/skeletons/account/PrimaryAddressSkeleton";
import LastOrderSkeleton from "../../components/skeletons/account/LastOrderSkeleton";
import {selectCurrentUser} from "../../redux/features/store/authSlice";
import Container from "../../components/ui/Container";
import {useGetEmailConfirmationStatusQuery} from "../../redux/features/api/stuffApiSlice";
import {useTranslation} from "react-i18next";
import {safeArrElAccess} from "../../lib/stuff";


const AccountDetails = () => {
    window.document.title = 'Account | Timshee store'
    const user = useSelector(selectCurrentUser);
    const { currentData: addresses,  isLoading: isAddressesLoading } = useGetAddressesByUserQuery();
    const { currentData: orders,  isLoading: isOrdersLoading } = useGetOrdersByUserQuery();

    const secondBlock = clsx(
        "items-center justify-items-center pb-[50px]",
        'max-sm:flex max-sm:flex-col',
        'lg:grid lg:grid-cols-2 lg:gap-x-1'
    );
    const lastOrder = safeArrElAccess(orders, -1);

    return (
        <Container>
            {user ? <EmailBlock user={user} /> : <EmailSkeleton />}
            <div className={secondBlock} data-second-block="">
                {isAddressesLoading
                    ? <PrimaryAddressSkeleton />
                    : <PrimaryAddress primaryAddress={addresses?.find(a => a.as_primary)} />}
                {isOrdersLoading
                    ? <LastOrderSkeleton />
                    : <LastOrder lastOrder={lastOrder} deliveredAt={"lastOrder"} />
                }
            </div>
        </Container>
    )

};

export default AccountDetails;