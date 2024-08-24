import React from 'react';
import AddButton from "../../../components/ui/AddButton";
import BackButton from "../../../components/ui/BackButton";
import AddressesList from "../../../components/account/addresses/AddressesList";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAddressFormOpen, toggleAddressForm} from "../../../redux/features/store/uiControlsSlice";
import {setAddress} from "../../../redux/features/store/accountSlice";
import Container from "../../../components/ui/Container";

export default function Addresses() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const addAddress = () => {
        dispatch(toggleAddressForm());
        dispatch(setAddress(null));
    };

    return (
        <Container>
            <BackButton to={'/account/details'}>
                {t('account:returnToAccount')}
            </BackButton>
            <AddressesList />
            <AddButton onClick={addAddress}>
                {t('account:addAddress')}
            </AddButton>
        </Container>
    );
};



