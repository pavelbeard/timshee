import React from "react";
import {clsx} from "clsx";
import AddressForm from "./forms/AddressForm";
import {useAccountContext} from "../../../lib/hooks";
import Loading from "../../../pages/Loading";
import Error from "../../../pages/Error";
import AddressCard from "./AddressCard";
import Nothing from "../../../pages/Nothing";

export default function AddressesComponent(props) {
    const { isAddressFormOpened } = useAccountContext();
    return isAddressFormOpened ? <AddressForm /> : <AddressesList />
}

function AddressesList(props) {
    const { isLoading, addresses  } = useAccountContext();

    if (isLoading) {
        return <Loading />
    } else if (!isLoading) {
        return (
            <div className={clsx(
                'max-sm:flex max-sm:flex-col gap-4',
                'lg:grid lg:grid-cols-3',
                'lg:grid lg:grid-cols-3',
            )}>
                {Array.isArray(addresses) && addresses.length > 0
                    ? addresses.map((address, index) => <AddressCard address={address} key={index} />)
                    : <Nothing />
                }
            </div>
        )
    } else {
        return <Error />
    }
}
