import React from 'react';
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../redux/slices/menuSlice";
import {changeAddress} from "../../redux/slices/editAddressSlice";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

const Addresses = ({ showInAccountPrimaryOne }) => {
    const dispatch = useDispatch();
    const csrftoken = Cookies.get("csrftoken");

    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);

    const [addresses, setAddresses] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [deletingAddress, setDeletingAddress] = useState(false);

    const getAddresses = async () => {
        const userId = parseInt(localStorage.getItem('userId'));
        const response = await fetch(API_URL + `api/order/addresses/?user__id=${userId}`, {
            credentials: "include",
        });
        const json = await response.json();
        setAddresses(json);
    };

    const deleteAddress = async (addressId) => {
        try {
            const response = await fetch(API_URL + `api/order/addresses/${addressId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Could not delete address");
            }

            setDeletingAddress(prevDeletingAddress => !prevDeletingAddress)
        } catch (e) {
            setErrorMessage("Something went wrong: " + e.message);
        }
    }

    useEffect(() => {
        getAddresses();
    }, [isEditAddressMenuClicked, deletingAddress]);

    if (showInAccountPrimaryOne) {
        return (
            <div className="primary-address-container">
                <div className="primary-address-name">PRIMARY ADDRESS</div>
                <div className="divider"></div>
                {addresses.map((address, index) => {
                    if (address.as_primary)
                        return (
                            <div className="primary-address" key={index}>
                                <div>{address.first_name} {address.last_name}</div>
                                <div>{address.address1}</div>
                                <div>{address.address2}</div>
                                <div>{address.postal_code}</div>
                                <div>{address.city}</div>
                                <div>{address.province.name}</div>
                                <div>{address.province.country.name}</div>
                                <div>{address.phone_number}</div>
                                <div>{address.email}</div>
                                <Link className="edit-addresses" to="/account/addresses">Edit addresses</Link>
                            </div>
                        );
                })}
            </div>
        )
    }

    const callEditAddressForm = (data) => {
        dispatch(toggleAddressEditForm());
        dispatch(changeAddress(data));
    };

    return (
        <>
            <div className="return-to-account">
                <Link to="/account/details">RETURN TO ACCOUNT</Link>
            </div>
            <div className="addresses-container">
                {addresses.map((address, index) => {
                    return (
                        <div className="address-item" key={index}>
                            {
                                address.as_primary ?
                                    <div className="primary-address">PRIMARY ADDRESS</div>
                                    :
                                    <div className="filler">ADDRESS {index + 1} </div>
                            }
                            <div className="divider"></div>
                            <div>{address.first_name} {address.last_name}</div>
                            <div>{address.address1}</div>
                            <div>{address.address2}</div>
                            <div>{address.postal_code}</div>
                            <div>{address.city}</div>
                            <div>{address.province.name}</div>
                            <div>{address.province.country.name}</div>
                            <div>{"+" + address.phone_code.phone_code + " " + address.phone_number}</div>
                            <div>{address.email}</div>
                            <div className="change-block">
                                <div onClick={() => {
                                    callEditAddressForm({
                                        first_name: address.first_name,
                                        last_name: address.last_name,
                                        address1: address.address1,
                                        address2: address.address2,
                                        postal_code: address.postal_code,
                                        city: address.city,
                                        province_obj: address.province,
                                        phone_code_obj: address.phone_code,
                                        phone_number: address.phone_number,
                                        email: address.email,
                                        address_id: address.id,
                                        as_primary: address.as_primary,
                                    });
                                }}>Edit
                                </div>
                                <div onClick={() => deleteAddress(address.id)}>Delete</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="add-address" onClick={() => callEditAddressForm(null)}>
                <p>Add address</p>
            </div>
        </>
    );
};

export default Addresses;