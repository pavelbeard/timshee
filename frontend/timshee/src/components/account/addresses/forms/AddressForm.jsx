import React, {useEffect, useState} from "react";

import CustomInput from "../../../ui/forms/CustomInput";
import {clsx} from "clsx";
import CustomSelect from "../../../ui/forms/CustomSelect";
import Button from "../../../ui/Button";
import CustomTitle from "../../../ui/forms/CustomTitle";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {useTranslation} from "react-i18next";
import {
    useGetCountriesQuery,
    useGetPhoneCodesQuery,
    useGetProvincesQuery,
    usePostAddressMutation,
    usePutAddressMutation
} from "../../../../redux/features/api/accountApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {
    setAddress,
    selectCurrentAddress,
} from "../../../../redux/features/store/accountSlice";
import {toggleAddressForm} from "../../../../redux/features/store/uiControlsSlice";
import Loading from "../../../../pages/Loading";



const AddressForm = ({ onClose }) => {
    const formContainer = clsx(
        'w-11/12 h-[85%]',
        'md:w-3/5',
        'lg:w-2/5',
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const address = useSelector(selectCurrentAddress);
    const { currentData: countries, isLoading: isGetCountriesLoading } = useGetCountriesQuery();
    const { currentData: provinces, isLoading: isGetProvincesLoading } = useGetProvincesQuery();
    const { currentData: phoneCodes, isLoading: isGetPhoneCodesLoading } = useGetPhoneCodesQuery();
    const [postAddress] = usePostAddressMutation();
    const [putAddress] = usePutAddressMutation();
    const [tmpProvinces, setTmpProvinces] = useState([]);
    const [error, setError] = useState(null);

    const isLoading = isGetCountriesLoading && isGetProvincesLoading && isGetPhoneCodesLoading;

    useEffect(() => {
        if(provinces) {
            setTmpProvinces(provinces);
        }
    }, [])

    useEffect(() => {
        setError(null);
    }, [address]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {...address, province: address.province.id, phone_code: address.phone_code.country};

        try {
            if (address?.id) {
                await putAddress(data).unwrap();
            } else {
                await postAddress(data).unwrap();
            }
            onClose.call();
        } catch (e) {
            if (e?.originalStatus === 400) setError(t('errors:addressFormError400'))
            else if (e?.originalStatus === 404) setError(t('errors:serverError'))
            else if (e?.originalStatus === 500) setError(t('errors:serverError'))
        }
    };

    const changeCountry = e => {
        const countryId = parseInt(e.target.value);
        const newProvinces = provinces.filter(province => province.country.id === countryId);
        const phoneCode = phoneCodes.find(pc => pc.country === countryId);
        setTmpProvinces(newProvinces);
        dispatch(setAddress(({...address, province: newProvinces[0], phone_code: phoneCode})));
    };

    const changeAddressFormData = e => {
        dispatch(setAddress(({...address, [e.target.id]: e.target.value})));
    };

    if (isLoading) {
        return <Loading />
    } else {
        return (
            <div
                className={clsx(
                    'fixed inset-0 z-10 overflow-y-auto flex items-center justify-center min-h-full',
                )}
            >
                <form
                    onClick={e => e.stopPropagation()}
                    onSubmit={handleSubmit}
                    className={clsx(
                        "flex flex-col z-[60] overflow-y-auto p-6 bg-white",
                        formContainer
                    )}>
                    <CustomTitle
                        title={address?.first_name ? 'Редактирование адреса' : 'Добавление адреса'}/>
                    <CustomInput
                        htmlFor="first_name"
                        name="first_name"
                        labelText={t('account.forms:firstname')}
                        type="text"
                        required={true}
                        value={address?.first_name || ""}
                        onChange={changeAddressFormData}
                    />
                    <CustomInput
                        htmlFor="last_name"
                        name="last_name"
                        labelText={t('account.forms:lastname')}
                        type="text"
                        required={true}
                        value={address?.last_name || ""}
                        onChange={changeAddressFormData}
                    />
                    <CustomInput
                        htmlFor="address1"
                        name="address1"
                        labelText={t('account.forms:streetAddress')}
                        type="text"
                        required={true}
                        value={address?.address1 || ""}
                        onChange={changeAddressFormData}
                    />
                    <CustomInput
                        htmlFor="address2"
                        name="address2"
                        type="text"
                        labelText={t('account.forms:apartment')}
                        value={address?.address2 || ""}
                        onChange={changeAddressFormData}
                    />
                    <CustomInput
                        htmlFor="postal_code"
                        name="postal_code"
                        type="text"
                        labelText={t('account.forms:postalCode')}
                        required={true}
                        value={address?.postal_code || ""}
                        onChange={changeAddressFormData}
                    />
                    <div className="flex flex-col justify-between lg:flex-row">
                        <CustomSelect
                            htmlFor="country"
                            labelText={t('account.forms:country')}
                            required={true}
                            value={address?.province?.country?.id || 0}
                            onChange={changeCountry}
                        >
                            {Array.isArray(countries) && countries.map((item, index) => (
                                <option key={index + 1} value={item?.id}>{item.name}</option>
                            )).concat([
                                (<option key={0} value={0}>------</option>)
                            ])}
                        </CustomSelect>
                        <CustomInput
                            htmlFor="city"
                            type="text"
                            labelText={t('account.forms:city')}
                            required={true}
                            value={address?.city || ""}
                            onChange={changeAddressFormData}
                        />
                        <CustomSelect
                            htmlFor="province"
                            name="province"
                            labelText={t('account.forms:province')}
                            required={true}
                            value={address?.province?.id || 0}
                            onChange={e => dispatch(
                                setAddress({...address, province: provinces.find(p => p.id === parseInt(e.target.value))})
                            )}
                        >
                            {[...tmpProvinces.filter(
                                province => province.country.id === address?.province?.country?.id
                            )].map((item, index) => (
                                <option key={index + 1} value={item?.id}>{item.name}</option>
                            )).concat([<option key={0} value={0}>------</option>])}
                        </CustomSelect>
                    </div>
                    <CustomInput
                        htmlFor="phone_number"
                        name="phone_number"
                        type="tel"
                        // pattern="[0-9]{3}-[0-9]{3}-[0-9]{3,4}"
                        labelText={t('account.forms:phoneNumber')}
                        required={true}
                        value={address?.phone_number || ""}
                        onChange={changeAddressFormData}
                    />
                    <CustomInput
                        htmlFor="email"
                        name="email"
                        type="email"
                        labelText={t('email')}
                        required={true}
                        value={address?.email}
                        onChange={changeAddressFormData}
                    />
                    <CustomInput
                        htmlFor="as_primary"
                        name="as_primary"
                        type="checkbox"
                        labelText={t('account.forms:asPrimary')}
                        required={false}
                        checked={address?.as_primary}
                        onChange={e => dispatch(setAddress({...address, as_primary: e.target.checked }))}
                    />
                    <div className="flex items-center justify-between">
                        <div className="w-1/2">
                            <Button className="h-6">{t('account.forms:submit')}</Button>
                        </div>
                        <XMarkIcon
                            strokeWidth="0.5"
                            onClick={onClose}
                            className={clsx(
                                "w-6 h-6 border-black border-[1px] mt-2",
                                'hover:bg-black hover:text-white cursor-pointer',
                            )}
                        />
                    </div>
                    <div className="text-red-500">
                        {error}
                    </div>
                </form>
            </div>
        )
    }
};

export default AddressForm;