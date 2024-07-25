import React, { useEffect } from "react";
import t from "../../../../translate/TranslateService";
import {clsx} from "clsx";
import {useAddressesStore} from "../store";
import AddressForm from "../forms/address-form";
import AuthService from "../../../../api/authService";

const container = clsx(
    'px-[30px]',
    'max-sm:flex max-sm:flex-col',
    'lg:grid lg:grid-cols-3',
    'lg:grid lg:grid-cols-3',
    'lg:gap-x-1'
);

const infoBlock = clsx(
    'tracking-widest'
);

const divider = clsx(
    'bg-gray-300 mb-2 h-[0.0825rem]',
);

const changeAddress = clsx(
    'flex underline underline-offset-2 cursor-pointer',
    'max-sm:2/3',
    'md:w-3/5',
    'lg:w-10/12',
    'xl:w-2/3',
);

export default function Addresses(props) {
    const { isAddressFormOpened } = useAddressesStore();
    return isAddressFormOpened ? <AddressForm /> : <AddressesList />
}

function AddressesList(props) {
    const token = AuthService.getAccessToken();
    const language = t.language();
    const { addresses, getAddresses, deleteAddress, throwAddress, toggleAddressForm } = useAddressesStore();

    const callEditAddressForm = address => {
        toggleAddressForm();
        throwAddress(address);
    };

    useEffect(() => {
        async function f() {
            await getAddresses(token);
        }
        f();
    }, [])

    return (
        <div className={container}>
            {Array.isArray(addresses) && addresses.map((address, index) => (
                <div className="w-full max-sm:pb-6 md:pb-6" key={index}>
                    {address.as_primary ?
                        <PrimaryBlock language={language} /> :
                        <CommonBlock language={language} index={index} />
                    }
                    <div className={divider}></div>
                    <div>{address?.first_name} {address?.last_name}</div>
                    <div>{address?.address1}</div>
                    <div>{address?.address2}</div>
                    <div>{address?.postal_code}</div>
                    <div>{address?.city}</div>
                    <div>{address?.province.name}</div>
                    <div>{address?.province.country.name}</div>
                    <div>{"±" + address?.phone_code.phone_code + " " + address?.phone_number}</div>
                    <div>{address.email}</div>
                    <div className={changeAddress}>
                        <div onClick={() => callEditAddressForm(address)}>
                            {t.account.edit[language]}
                        </div>
                        <div className="pl-3" onClick={() => deleteAddress(token, address.id)}>
                            {t.account.delete[language]}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function PrimaryBlock(props) {
    const { language } = props;
    return (
        <div className={infoBlock}>{t.account.primaryAddress[language]}</div>
    )
}

function CommonBlock(props) {
    const { language, index } = props;
    return (
        <div className={infoBlock}>{t.account.address[language]} {index + 1}</div>
    )
}
