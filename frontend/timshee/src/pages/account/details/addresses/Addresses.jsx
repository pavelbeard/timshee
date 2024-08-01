import React from 'react';
import {useAccountContext} from "../../../../lib/hooks";
import {useNavigate} from "react-router-dom";
import AddButton from "../../../../components/ui/AddButton";
import BackButton from "../../../../components/ui/BackButton";
import AddressesComponent from "../../../../components/account/addresses/AddressesComponent";
import {useTranslation} from "react-i18next";

export default function Addresses() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAddressFormOpened, toggleAddressForm } = useAccountContext();
    return isAddressFormOpened ? <AddressesComponent /> : (
        <div className="min-h-[100vh] mx-6 mb-3">
            <BackButton to={'/account/details'}>
                {t('account:returnToAccount')}
            </BackButton>
            <AddressesComponent />
            <AddButton onClick={() => toggleAddressForm(true)}>
                {t('account:addAddress')}
            </AddButton>
        </div>
    );
};



