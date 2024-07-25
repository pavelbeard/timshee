import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../../../api/authService";
import t from "../../../translate/TranslateService";
import Loading from "../../../techPages/loading";
import Error from "../../../techPages/error";
import Nothing from "../../../techPages/nothing";
import {clsx} from "clsx";
import Addresses from "./components/addresses";
import {useAddressesStore} from "./store";
import {Button} from "../../../../components/button";
import NotFound from "../../../../not-found";

const container = clsx(
    'px-[30px]',
    'max-sm:flex max-sm:flex-col',
    'lg:grid lg:grid-cols-3',
    'lg:grid lg:grid-cols-3',
    'lg:gap-x-1'
);

const btnContainer = clsx(
    'pl-[30px]',
    'max-sm:w-2/3',
    'md:w-2/3',
    'lg:w-1/3',
);

const btn = clsx(
    'border-[1px] border-black flex items-center justify-center cursor-pointer',
    'tracking-widest py-3 mt-2',
    'hover:bg-black hover:text-white',
    'max-sm:2/3',
    'md:w-3/5',
    'lg:w-10/12',
    'xl:w-2/3'
);

export default function AddressesPage() {
    const token = AuthService.getAccessToken();
    const language = t.language();
    const { addresses, isAddressFormOpened, toggleAddressForm } = useAddressesStore();
    return isAddressFormOpened ? <Addresses token={token} /> : (
        <>
            <ReturnToAccount language={language} />
            {Array.isArray(addresses) && addresses.length > 0 ? (
                <>
                    <Addresses token={token} />
                    <CreateAddress language={language} toggleAddressForm={toggleAddressForm} />
                </>
            ) : (
                <Nothing language={language} />
            )}
        </>
    );
};

function ReturnToAccount(props) {
    const { language } = props;
    const navigate = useNavigate();
    return (
        <div className={clsx(btnContainer, 'pb-[50px]')}>
            <Button onClick={() => navigate('/account/details')}>
                {t.account.returnToAccount[language]}
            </Button>
        </div>
    )
}

function CreateAddress(props) {
    const { language, toggleAddressForm } = props;
    return (
        <div className={clsx(btnContainer, 'pb-[50px]')}>
            <Button onClick={toggleAddressForm}>
                {t.account.addAddress[language]}
            </Button>
        </div>
    )
}