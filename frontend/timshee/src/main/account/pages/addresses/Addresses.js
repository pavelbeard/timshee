import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../../../redux/slices/menuSlice";
import {
    deleteAddress,
    getAddresses
} from "../forms/reducers/asyncThunks";
import {editAddress} from "../forms/reducers/addressFormSlice";
import AuthService from "../../../api/authService";
import t from "../../../translate/TranslateService";
import Loading from "../../../techPages/Loading";
import Error from "../../../techPages/Error";
import Nothing from "../../../techPages/Nothing";
import {selectCurrentToken} from "../../../../redux/services/features/auth/authSlice";

const Addresses = () => {
    const dispatch = useDispatch();

    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);
    const token = useSelector(selectCurrentToken);
    const language = t.language();
    const {addresses, shippingAddressesStatus} = useSelector(state => state.addressForm);
    const {deleteAddressStatus} = useSelector(state => state.editAddress);

    useEffect(() => {
        if (token && shippingAddressesStatus === 'idle') {
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

    if (shippingAddressesStatus === 'success') {
        return (
            <>
                <div className="return-to-account">
                    <Link to="/account/details">{
                        t.account.returnToAccount[language]
                    }</Link>
                </div>
                {
                    addresses.length > 0 ? (
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
                                        <div>{"±" + address?.phone_code.phone_code + " " + address?.phone_number}</div>
                                        <div>{address.email}</div>
                                        <div className="change-block">
                                            <div onClick={() => callEditAddressForm(address)}>
                                                {t.account.edit[language]}
                                            </div>
                                            <div onClick={() => dispatch(deleteAddress({
                                                token, addressId: address.id
                                            }))}>
                                                {t.account.delete[language]}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <Nothing/>
                    )
                }
                <div className="add-address" onClick={() => callEditAddressForm(undefined)}>
                    <p>{t.account.addAddress[language]}</p>
                </div>
            </>
        );
    } else if (shippingAddressesStatus === 'loading') {
        return <Loading/>;
    } else if (shippingAddressesStatus === 'error') {
        return <Error/>;
    }


};

export default Addresses;