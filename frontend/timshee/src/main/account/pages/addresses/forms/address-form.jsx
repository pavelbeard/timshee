import React, {useEffect} from "react";

import AuthService from "../../../../api/authService";
import CustomInput from "../../../../../components/custom-input";
import {useAddressesStore} from "../store";
import {clsx} from "clsx";
import {useGlobalStore} from "../../../../../store";
import CustomSelect from "../../../../../components/custom-select";
import {Button} from "../../../../../components/button";
import CustomTitle from "../../../../../components/custom-title";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {useTranslation} from "react-i18next";

const formContainer = clsx(
    'max-sm:w-10/12',
    'md:w-3/5',
    'lg:w-2/5',
);

const h1 = clsx(
    'pb-3',
    'max-sm:text-lg',
    'md:text-xl',
    'lg:text-2xl',
);


const AddressForm = (props) => {
    const token = AuthService.getAccessToken();
    const { t, i18n } = useTranslation();
    const { address, editAddress, toggleAddressForm, addressForm, addAddress } = useAddressesStore();
    const {
        countries, provinces, phoneCodes,
        getCountries, getProvinces, getPhoneCodes,
    } = useGlobalStore();

    const [_countries, setCountries] = React.useState([]);
    const [_provinces, setProvinces] = React.useState([]);
    const [_phoneCodes, setPhoneCodes] = React.useState([]);

    useEffect(() => {
        async function f() {
            await getCountries();
            await getProvinces();
            await getPhoneCodes();
        }

        f();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {...address, province: address.province.id, phone_code: address.phone_code.country};

        if (address?.id) {
            await editAddress(token, data, address.id)
        } else {
            await addAddress(token, data)
        }

        toggleAddressForm();
    };

    const changeCountry = e => {
        const countryId = parseInt(e.target.value);
        const newProvinces = provinces.filter(province => province.country.id === countryId);
        const phoneCode = phoneCodes.find(pc => pc.country === countryId);
        setProvinces(newProvinces);
        addressForm({province: newProvinces[0], phone_code: phoneCode});
    };

    return (
        <div className="flex flex-col items-center justify-center pb-6">
            <form onSubmit={handleSubmit} className={clsx("flex flex-col", formContainer)}>
                <CustomTitle title={address?.first_name ? 'Редактирование адреса' : 'Добавление адреса'} />
                <CustomInput
                    htmlFor="first_name"
                    labelText={t('firstname')}
                    type="text"
                    required={true}
                    value={address?.first_name || ""}
                    onChange={e => addressForm({first_name: e.target.value})}
                />
                <CustomInput
                    htmlFor="last_name"
                    labelText={t('lastname')}
                    type="text"
                    required={true}
                    value={address?.last_name || ""}
                    onChange={e => addressForm({last_name: e.target.value})}
                />
                <CustomInput
                    htmlFor="address1"
                    labelText={t('streetAddress')}
                    type="text"
                    required={true}
                    value={address?.address1 || ""}
                     onChange={e => addressForm({address1: e.target.value})}
                />
                <CustomInput
                    htmlFor="address2"
                    type="text"
                    labelText={t('apartment')}
                    value={address?.address2 || ""}
                     onChange={e => addressForm({address2: e.target.value})}
                />
                <CustomInput
                    htmlFor="postal_code"
                    type="text"
                    labelText={t('postalCode')}
                    required={true}
                    value={address?.postal_code || ""}
                    onChange={e => addressForm({postal_code: e.target.value})}
                />
                <div className="flex justify-between">
                    <CustomSelect
                        htmlFor="country"
                        labelText={t('country')}
                        required={true}
                        value={address?.province?.country?.id || 0}
                        onChange={changeCountry}
                    >
                        {countries.map((item, index) => (
                            <option key={index + 1} value={item?.id}>{item.name}</option>
                        )).concat([
                            (<option key={0} value={0}>------</option>)
                        ])}
                    </CustomSelect>
                    <CustomInput
                        htmlFor="city"
                        type="text"
                        labelText={t('city')}
                        required={true}
                        value={address?.city || ""}
                         onChange={e => addressForm({city: e.target.value})}
                    />
                    <CustomSelect
                        htmlFor="province"
                        labelText={t('province')}
                        required={true}
                        value={address?.province?.id || 0}
                        onChange={e => addressForm({province: provinces.find(p => p.id === parseInt(e.target.value))})}
                    >
                        {provinces.filter(
                            province => province.country.id === address?.province?.country?.id
                        ).map((item, index) => (
                            <option key={index + 1} value={item?.id}>{item.name}</option>
                        )).concat([<option key={0} value={0}>------</option>])}
                    </CustomSelect>
                </div>
                <CustomInput
                    htmlFor="phone_number"
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{3,4}"
                    labelText={t('phoneNumber')}
                    required={true}
                    value={address?.phone_number || ""}
                    onChange={e => addressForm({phone_number: e.target.value})}
                />
                <CustomInput
                    htmlFor="email"
                    type="email"
                    labelText={t('email')}
                    required={true}
                    value={address?.email}
                     onChange={e => addressForm({email: e.target.value})}
                />
                <CustomInput
                    htmlFor="as_primary"
                    type="checkbox"
                    labelText={t('asPrimary')}
                    required={false}
                    checked={address?.as_primary }
                    onChange={e => addressForm({as_primary: e.target.checked})}
                />
                <div className="flex items-center justify-between">
                    <div className="w-1/2">
                        <Button className="h-6">{t('submit')}</Button>
                    </div>
                    <XMarkIcon
                        onClick={toggleAddressForm}
                        className={clsx(
                            "w-6 h-6 border-black border-[1px] mt-2",
                            'hover:bg-black hover:text-white cursor-pointer',
                        )}
                    />
                </div>
            </form>
        </div>
    )
};

export default AddressForm;