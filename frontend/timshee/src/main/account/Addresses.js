import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../redux/slices/menuSlice";
import {
    deleteAddress,
    getAddresses
} from "./forms/reducers/asyncThunks";
import {editAddress} from "./forms/reducers/addressFormSlice";
import AuthService from "../api/authService";
import translateService from "../translate/TranslateService";

const Addresses = () => {
    const dispatch = useDispatch();

    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);
    const token = AuthService.getCurrentUser();
    const language = translateService.language();
    const {addresses, shippingAddressesStatus} = useSelector(state => state.addressForm);
    const {deleteAddressStatus} = useSelector(state => state.editAddress);

    useEffect(() => {
        if (token?.access && shippingAddressesStatus === 'idle') {
            dispatch(getAddresses({token}));
        }
    }, [shippingAddressesStatus, isEditAddressMenuClicked, deleteAddressStatus]);

    const callEditAddressForm = (rawAddressObject) => {
        dispatch(toggleAddressEditForm());
        dispatch(editAddress({
            id: rawAddressObject?.id,
            firstName: rawAddressObject?.first_name || "",
            lastName: rawAddressObject?.last_name || "",
            streetAddress: rawAddressObject?.address1 || "",
            apartment: rawAddressObject?.address2 || "",
            postalCode: rawAddressObject?.postal_code || "",
            city: rawAddressObject?.city || "",
            province: {
                id: rawAddressObject?.province.id || 0,
                name: rawAddressObject?.province.name || "",
                country: {
                    id: rawAddressObject?.province.country.id || 0,
                    name: rawAddressObject?.province.name || "",
                }
            },
            phoneCode: {
                country: rawAddressObject?.phone_code.country || 0,
                phoneCode: rawAddressObject?.phone_code.phone_code || "",
            },
            phoneNumber: rawAddressObject?.phone_number || "",
            email: rawAddressObject?.email || "",
            asPrimary: rawAddressObject?.as_primary || false,
        }));
    };

    return (
        <>
            <div className="return-to-account">
                <Link to="/account/details">{
                    translateService.account.returnToAccount[language]
                }</Link>
            </div>
            <div className="items-container">
                {typeof addresses.map === "function" && addresses.map((address, index) => {
                    return (
                        <div className="item" key={index}>
                            {
                                address.as_primary ?
                                    <div className="info-block">{translateService.account.primaryAddress[language]}</div>
                                    :
                                    <div className="filler">{translateService.account.address[language]} {index + 1} </div>
                            }
                            <div className="divider"></div>
                            <div>{address?.first_name} {address?.last_name}</div>
                            <div>{address?.address1}</div>
                            <div>{address?.address2}</div>
                            <div>{address?.postal_code}</div>
                            <div>{address?.city}</div>
                            <div>{address?.province.name}</div>
                            <div>{address?.province.country.name}</div>
                            <div>{"±" + address?.phone_code.phone_code + " " + address?.phone_number}</div>
                            <div>{address.email}</div>
                            <div className="change-block">
                                <div onClick={() => callEditAddressForm(address)}>
                                    {translateService.account.edit[language]}
                                </div>
                                <div onClick={() => dispatch(deleteAddress({
                                    token, addressId: address.id
                                }))}>
                                    {translateService.account.delete[language]}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="add-address" onClick={() => callEditAddressForm(undefined)}>
                <p>{translateService.account.addAddress[language]}</p>
            </div>
        </>
    );
};

export default Addresses;