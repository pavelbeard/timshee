import CustomInput from "../../../ui/forms/CustomInputNew";
import {useCheckoutFormContext} from "../../../../lib/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import CustomSelect from "../../../ui/forms/CustomSelect";
import {useSelector} from "react-redux";
import {selectIsSignInAtCheckoutChecked} from "../../../../redux/features/store/uiControlsSlice";
import CustomCheckbox from "../../../ui/forms/CustomCheckbox";
import {safeArrElAccess} from "../../../../lib/stuff";

export default function ShippingAddress() {
    const { t } = useTranslation();
    const {
        token,
        formData,
        setFormData,
        setCountries,
        countries,
        _provinces,
        setNewProvince
    } = useCheckoutFormContext();
    const showSignin = useSelector(selectIsSignInAtCheckoutChecked);
    return(
        <>
            {!token && !showSignin &&
                <section className="p-2">
                    <CustomInput
                        htmlFor="email"
                        labelText={'Email:'}
                        name="email"
                        type="email"
                        value={formData?.shipping_address?.email || ""}
                        onChange={setFormData}
                        required
                    />
                </section>}
            <section className="">
                <CustomSelect
                    htmlFor="country"
                    labelText={t('account.forms:country')}
                    className={'mb-3 p-2'}
                    name="country"
                    type="select"
                    value={formData?.shipping_address?.province?.country?.id || 0}
                    onChange={setCountries}
                    required
                    selectClassName="my-4"
                >
                    {Array.isArray(countries) && countries.map((item, index) => (
                        <option key={index + 1} value={item?.id}>{item.name}</option>
                    )).concat([
                        (<option key={0} value={0}>------</option>)
                    ])}
                </CustomSelect>
                    <CustomInput
                        htmlFor="first_name"
                        name="first_name"
                        labelText={t('account.forms:firstname')}
                        type="text"
                        required={true}
                        value={formData?.shipping_address?.first_name || ""}
                        onChange={setFormData}
                    />
                    <CustomInput
                        htmlFor="last_name"
                        name="last_name"
                        labelText={t('account.forms:lastname')}
                        type="text"
                        required={true}
                        value={formData?.shipping_address?.last_name || ""}
                        onChange={setFormData}
                    />
                    <CustomInput
                        htmlFor="address1"
                        name="address1"
                        labelText={t('account.forms:streetAddress')}
                        type="text"
                        required={true}
                        value={formData?.shipping_address?.address1 || ""}
                        onChange={setFormData}
                    />
                    <CustomInput
                        htmlFor="address2"
                        name="address2"
                        type="text"
                        labelText={t('account.forms:apartment')}
                        value={formData?.shipping_address?.address2 || ""}
                        onChange={setFormData}
                    />
            </section>
            <section className="flex flex-col lg:flex-row lg:justify-between" data-location-container="">
                <CustomInput
                    htmlFor="postal_code"
                    name="postal_code"
                    type="text"
                    labelText={t('account.forms:postalCode')}
                    required={true}
                    value={formData?.shipping_address?.postal_code || ""}
                    onChange={setFormData}
                />
                <CustomInput
                    htmlFor="city"
                    name="city"
                    type="text"
                    labelText={t('account.forms:city')}
                    required={true}
                    value={formData?.shipping_address?.city || ""}
                    onChange={setFormData}
                />
                <CustomSelect
                    htmlFor="province"
                    name="province"
                    labelText={t('account.forms:province')}
                    required={true}
                    value={formData?.shipping_address?.province?.id || 0}
                    onChange={setNewProvince}
                    selectClassName="my-4"
                >
                    {_provinces.filter(
                        province => province?.country?.id
                            === formData?.shipping_address?.province?.country?.id || safeArrElAccess(countries, 0)?.id
                    ).map((item, index) => (
                        <option key={index + 1} value={item?.id}>{item?.name}</option>
                    )).concat([<option key={0} value={0}>------</option>])}
                </CustomSelect>
            </section>
            <section className="flex flex-col lg:flex-row lg:justify-between" data-contacts-container="">
                <CustomInput
                    htmlFor="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder={`+${formData?.shipping_address?.phone_code?.phone_code || "0"}`}
                    // pattern="[0-9]{3}-[0-9]{3}-[0-9]{3,4}"
                    labelText={t('account.forms:phoneNumber')}
                    required={true}
                    value={formData?.shipping_address?.phone_number || ""}
                    onChange={setFormData}
                />
                {token &&
                    <CustomCheckbox
                        labelClassName={'w-1/3'}
                        htmlFor="as_primary"
                        name="as_primary"
                        type="checkbox"
                        labelText={t('account.forms:asPrimary')}
                        required={false}
                        checked={formData?.shipping_address?.as_primary || false}
                        onChange={setFormData}
                    />
                }
            </section>
        </>
    )
}