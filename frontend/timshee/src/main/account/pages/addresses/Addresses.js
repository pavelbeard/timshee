import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import t from "../../../translate/TranslateService";
import Loading from "../../../techPages/Loading";
import Nothing from "../../../techPages/Nothing";
import {
    toggleAddressForm,
    selectAddresses,
    setAddress,
    setAddresses,
    popAddress,
} from "../../../../redux/services/features/account/accountDataSlice";
import {
    useDeleteAddressMutation,
    useGetAddressesByUserMutation
} from "../../../../redux/services/features/account/accountDataApiSlice";

const Addresses = () => {
    const dispatch = useDispatch();
    const language = t.language();
    const addresses = useSelector(selectAddresses);
    const [getAddressesByUserMutation, { isLoading }] = useGetAddressesByUserMutation();
    const [deleteAddress] = useDeleteAddressMutation();

    useEffect(() => {
        if (addresses?.length === 0) {
            getAddressesByUserMutation().unwrap()
                .then((res) => {
                    dispatch(setAddresses(res))
                })
        }
    }, [])

    const callEditAddressForm = (rawAddressObject) => {
        if (rawAddressObject) {
            dispatch(setAddress({ ...rawAddressObject }));
        } else {
            dispatch(setAddress());
        }
        dispatch(toggleAddressForm());
    };

    const removeAddress = async (address) => {
        try {
            await deleteAddress(address).then(() => dispatch(popAddress(address)));
        } catch (e) {
            console.error(e.message);
        }
    };

    return (
            <>
                <div className="return-to-account">
                    <Link to="/account/details">{
                        t.account.returnToAccount[language]
                    }</Link>
                </div>
                {addresses.length > 0 ? (
                    <div className="items-container">
                        {addresses.map((address, index) => {
                            return (
                                <div className="item" key={index}>
                                    {
                                        address.as_primary ?
                                            <div
                                                className="info-block">{t.account.primaryAddress[language]}</div>
                                            :
                                            <div
                                                className="filler">{t.account.address[language]} {index + 1} </div>
                                    }
                                    <div className="divider"></div>
                                    <div>{address?.first_name} {address?.last_name}</div>
                                    <div>{address?.address1}</div>
                                    <div>{address?.address2}</div>
                                    <div>{address?.postal_code}</div>
                                    <div>{address?.city}</div>
                                    <div>{address?.province.name}</div>
                                    <div>{address?.province.country.name}</div>
                                    <div>{"±" + address?.phone_code?.phone_code + " " + address?.phone_number}</div>
                                    <div>{address.email}</div>
                                    <div className="change-block">
                                        <div onClick={() => callEditAddressForm(address)}>
                                            {t.account.edit[language]}
                                        </div>
                                        <div onClick={() => removeAddress(address)}>
                                            {t.account.delete[language]}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    ) : <Nothing/>

                }
                <div className="add-address" onClick={() => callEditAddressForm()}>
                    <p>{t.account.addAddress[language]}</p>
                </div>
            </>
        );
};

export default Addresses;