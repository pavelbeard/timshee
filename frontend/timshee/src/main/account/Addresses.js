import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../redux/slices/menuSlice";
import {changeAddress} from "../../redux/slices/editAddressSlice";

const API_URL = process.env.REACT_APP_API_URL;

const Addresses = ({ showInAccountPrimaryOne }) => {
    const dispatch = useDispatch();

    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);

    const [addresses, setAddresses] = useState([]);

    const getAddresses = async () => {
        const userId = Number(localStorage.getItem('userId'));
        const response = await fetch(API_URL + `api/order/addresses/?user__id=${userId}`, {
            credentials: "include",
        });
        const json = await response.json();
        setAddresses(json)
    };

    const setAddressesNotAsPrimary = async (e) => {

    }


    useEffect(() => {
        getAddresses();
    }, [isEditAddressMenuClicked]);

    if (showInAccountPrimaryOne) {
        return (
            <div>
                <div>Primary address:</div>
                {addresses.map((address) => {
                    if (address.as_primary)
                        return (
                            <>
                                <div>{address.first_name}</div>
                                <div>{address.last_name}</div>
                                <div>{address.address1}</div>
                                <div>{address.address2}</div>
                                <div>{address.postal_code}</div>
                                <div>{address.city.name}</div>
                                <div>{address.city.country.name}</div>
                                <div>{address.phone_number}</div>
                                <div>{address.email}</div>
                            </>
                        );
                })}
                <Link className="edit-addresses" to="/account/addresses">Edit addresses</Link>
            </div>
        )
    }

    const callEditAddressForm = (data) => {
        dispatch(toggleAddressEditForm());
        dispatch(changeAddress(data));
    };

    return (
        <div>
            {addresses.map((address, index) => {
                return (
                    <div key={index}>
                        {address.as_primary && (<div>PRIMARY ADDRESS</div>)}
                        <div>{address.first_name}</div>
                        <div>{address.last_name}</div>
                        <div>{address.address1}</div>
                        <div>{address.address2}</div>
                        <div>{address.postal_code}</div>
                        <div>{address.city.name}</div>
                        <div>{address.city.country.name}</div>
                        <div>{"+" + address.phone_code.phone_code + " " + address.phone_number}</div>
                        <div>{address.email}</div>
                        <div onClick={() => {
                            callEditAddressForm({
                                first_name: address.first_name,
                                last_name: address.last_name,
                                address1: address.address1,
                                address2: address.address2,
                                postal_code: address.postal_code,
                                city_obj: address.city,
                                phone_code_obj: address.phone_code,
                                phone_number: address.phone_number,
                                email: address.email,
                                address_id: address.id,
                                as_primary: address.as_primary,
                            });
                        }} style={{cursor: "grab"}}>Edit</div>
                        <div>Delete</div>
                    </div>
                )
            })}
        </div>
    );
};

export default Addresses;