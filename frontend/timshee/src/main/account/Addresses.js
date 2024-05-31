import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../redux/slices/menuSlice";
import {
    getShippingAddresses
} from "./forms/reducers/asyncThunks";
import {editAddress} from "./forms/reducers/addressFormSlice";
import AuthService from "../api/authService";
import {deleteAddress} from "../../redux/slices/editAddressSlice";

const Addresses = () => {
    const dispatch = useDispatch();

    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);
    const isAuthenticated = AuthService.isAuthenticated();
    const {addresses, addressObject, shippingAddressesStatus} = useSelector(state => state.addressForm);
    const {hasDeleted, deleteAddressStatus} = useSelector(state => state.editAddress);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getShippingAddresses({isAuthenticated: true}));
        }

    }, [addresses.length, addressObject.firstName, hasDeleted, isEditAddressMenuClicked, deleteAddressStatus]);

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
                <Link to="/account/details">RETURN TO ACCOUNT</Link>
            </div>
            <div className="items-container">
                {typeof addresses.map === "function" && addresses.map((address, index) => {
                    return (
                        <div className="item" key={index}>
                            {
                                address.as_primary ?
                                    <div className="info-block">PRIMARY ADDRESS</div>
                                    :
                                    <div className="filler">ADDRESS {index + 1} </div>
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
                                    Edit
                                </div>
                                {/*<Modal show={showAddressForm} handleClose={setShowAddressForm}>*/}
                                {/*    <EditAddressForm closeForm={setShowAddressForm} />*/}
                                {/*</Modal>*/}
                                <div onClick={() => dispatch(deleteAddress({
                                    isAuthenticated: isAuthenticated, addressId: address.id
                                }))}>
                                    Delete
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="add-address" onClick={() => callEditAddressForm(undefined)}>
                <p>Add address</p>
            </div>
        </>
    );
};

export default Addresses;