import React, {useEffect} from "react";

import CustomInput from "../../../ui/forms/CustomInput";
import {clsx} from "clsx";
import CustomSelect from "../../../ui/forms/CustomSelect";
import Button from "../../../ui/Button";
import CustomTitle from "../../../ui/forms/CustomTitle";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {api} from "../../../../lib/api";
import {useAccountContext, useInput} from "../../../../lib/hooks";

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


const AddressForm = () => {
    const { t } = useTranslation();
    const { address, changeAddress, toggleAddressForm, setAddress, postAddress } = useAccountContext();
    const { data, error } = useQuery({
        queryKey: ['account.address.form'],
        queryFn: async ({ signal }) => {
            const [countries, provinces, phoneCodes] = await Promise.all([
                api.get('/api/order/countries/', { signal }),
                api.get('/api/order/provinces/', { signal }),
                api.get('/api/order/phone-codes/', { signal }),
            ]);

            return { countries: countries.data, provinces: provinces.data, phoneCodes: phoneCodes.data };
        }
    })

    // local data
    const [countries, setCountries] = React.useState([]);
    const [provinces, setProvinces] = React.useState([]);
    const [tmpProvinces, setTmpProvinces] = React.useState([]);
    const [phoneCodes, setPhoneCodes] = React.useState([]);

    useEffect(() => {
        if (data?.countries && data?.provinces && data?.phoneCodes) {
            setCountries(data?.countries);
            setProvinces(data?.provinces);
            setTmpProvinces(data?.provinces);
            setPhoneCodes(data?.phoneCodes);
        }
    }, [data]);

    useEffect(() => {
        if (changeAddress.isSuccess || postAddress.isSuccess) {
            changeAddress.reset();
            postAddress.reset();
            toggleAddressForm(false);
        }
    }, [changeAddress, postAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {...address, province: address.province.id, phone_code: address.phone_code.country};

        if (address?.id) {
            await changeAddress.mutate(data)
        } else {
            await postAddress.mutate(data);
        }
    };

    const changeCountry = e => {
        const countryId = parseInt(e.target.value);
        const newProvinces = provinces.filter(province => province.country.id === countryId);
        const phoneCode = phoneCodes.find(pc => pc.country === countryId);
        setTmpProvinces(newProvinces);
        setAddress(prev => ({...prev, province: newProvinces[0], phone_code: phoneCode}));
    };

    const changeAddressFormData = e => {
        changeAddress?.reset();
        postAddress?.reset();
        setAddress(prev => ({...prev, [e.target.id]: e.target.value}));
    };

    return (
        <div className="flex flex-col items-center justify-center pb-6">
            <form onSubmit={handleSubmit} className={clsx("flex flex-col", formContainer)}>
                <CustomTitle
                    title={address?.first_name ? 'Редактирование адреса' : 'Добавление адреса'} />
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
                <div className="flex justify-between">
                    <CustomSelect
                        htmlFor="country"
                        labelText={t('account.forms:country')}
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
                        onChange={e => setAddress(prev =>
                            ({ ...prev, province: provinces.find(p => p.id === parseInt(e.target.value)) })
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
                    checked={address?.as_primary }
                    onChange={changeAddressFormData}
                />
                <div className="flex items-center justify-between">
                    <div className="w-1/2">
                        <Button className="h-6">{t('account.forms:submit')}</Button>
                    </div>
                    <XMarkIcon
                        onClick={() => toggleAddressForm(false)}
                        className={clsx(
                            "w-6 h-6 border-black border-[1px] mt-2",
                            'hover:bg-black hover:text-white cursor-pointer',
                        )}
                    />
                </div>
                <div className="text-red-500">
                    {error || changeAddress?.error?.message || postAddress?.error?.message}
                </div>
            </form>
        </div>
    )
};

export default AddressForm;