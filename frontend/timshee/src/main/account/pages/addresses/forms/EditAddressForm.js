import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleAddressEditForm} from "../../../../../redux/slices/menuSlice";
import "../../Forms.css";

import "../../../../Main.css";
import crossBtn from "../../../../../media/static_images/cruz.svg";
import {
    setError,
    setPhoneCode,
    setPhoneCodesFiltered,
    setProvince,
    setProvincesFiltered,
} from "../../forms/reducers/addressFormSlice";
import t from "../../../../translate/TranslateService";
import {selectCurrentToken} from "../../../../../redux/services/features/auth/authSlice";
import {
    useCreateAddressMutation,
    useGetCountriesMutation, useGetPhoneCodesMutation,
    useGetProvincesMutation, useUpdateAddressMutation
} from "../../../../../redux/services/features/account/accountDataApiSlice";
import {
    changeAddress,
    pushAddress,
    selectAddress,
    setAddress,
    setLocationData, toggleAddressForm
} from "../../../../../redux/services/features/account/accountDataSlice";

const EditAddressForm = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const [getCountries, { isLoading: isCountriesLoading }] = useGetCountriesMutation();
    const [getProvinces, { isLoading: isProvincesLoading }] = useGetProvincesMutation();
    const [getPhoneCodes, { isLoading: isPhoneCodesLoading }] = useGetPhoneCodesMutation();
    const [createAddress, { isLoading: isCreateAddressLoading }] = useCreateAddressMutation();
    const [updateAddress, { isLoading: isUpdateAddressLoading }] = useUpdateAddressMutation();
    const { address } = useSelector(state => state.accountData);
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [phoneCodes, setPhoneCodes] = useState([]);
    const [_provinces, _setProvinces] = useState([]);
    const [error, setError] = useState(null);
    const language = t.language();

    // FETCH COUNTRIES, PROVINCES AND MORE

    useEffect(() => {
        const fetchAll = async () => {
            const [countries, provinces, phoneCodes] = await Promise.all([
                getCountries().unwrap(),
                getProvinces().unwrap(),
                getPhoneCodes().unwrap(),
            ]);
            setCountries(countries);
            setProvinces(provinces);
            _setProvinces(provinces.filter(p => p.country.id === countries[0].id));
            setPhoneCodes(phoneCodes);
            dispatch(setAddress({ ...address, phone_code: phoneCodes.find(pc => pc.country === countries[0].id) }));
        }

        fetchAll();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!address?.id) {
                const newAddress = await createAddress({
                    ...address, province: address.province.id, phone_code: address.phone_code.country
                }).unwrap();
                dispatch(pushAddress(newAddress));
            } else {
                const updatedAddress = await updateAddress({
                    ...address, province: address.province.id, phone_code: address.phone_code.country
                }).unwrap();
                dispatch(changeAddress(updatedAddress));
            }
            dispatch(toggleAddressForm());

        } catch (e) {
            if (e?.status === 500) {
                setError('Что-то пошло не так...');
            }
        }
    };

    const changeCountry = (e) => {
        const countryId = parseInt(e.target.value);
        const filteredProvinces = provinces.filter(p => p.country.id === countryId);
        _setProvinces(filteredProvinces);
        dispatch(setAddress({
            ...address,
            province: provinces.filter(p => p.country.id === countryId)[0],
            phone_code: phoneCodes.find(pc => pc.country === countryId),
        }));
    };

    const changeProvince = (e) => {
        const provinceId = parseInt(e.target.value);
        dispatch(setAddress({
            ...address,
            province: provinces.find(p => p.id === provinceId),
        }));
    }

    const closeForm = () => {
        dispatch(toggleAddressForm());
    };

    const changeAddressState = e => {
        dispatch(setAddress({ ...address, [e.target.id]: e.target.value }));
    };


    return (
        <div className="overlay form-container">
            <div style={{ zIndex: "-1", width: "100%", minHeight: "100vh"}} onClick={closeForm}></div>
            <form onSubmit={handleSubmit} className={`forms-form ${window.innerWidth > 600 ?  "height-650" : "height-450"}`}>
                <span className="form-title">{t.account.editAddress[language]}</span>
                {error && <div className="errorMessage">{error}</div>}
                <div>
                    <label htmlFor="first_name">
                        <span className="label-text">{t.forms.firstname[language]}</span>
                        <input
                            id="first_name"
                            type="text"
                            value={address?.first_name}
                            onChange={changeAddressState}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="last_name">
                        <span className="label-text">{t.forms.lastname[language]}</span>
                        <input
                            id="last_name"
                            type="text"
                            value={address?.last_name}
                            onChange={changeAddressState}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="address1">
                        <span className="label-text">{t.forms.streetAddress[language]}</span>
                        <input
                            id="address1"
                            type="text"
                            value={address?.address1}
                            onChange={changeAddressState}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="address2">
                        <span className="label-text">{t.forms.apartment[language]}</span>
                        <input
                            id="address2"
                            type="text"
                            value={address?.address2}
                            onChange={changeAddressState}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="postal_code">
                        <span className="label-text">{t.forms.postalCode[language]}</span>
                        <input
                            id="postal_code"
                            type="text"
                            value={address?.postal_code}
                            onChange={changeAddressState}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="city">
                        <span className="label-text">{t.forms.city[language]}</span>
                        <input
                            id="city"
                            value={address?.city}
                            onChange={changeAddressState}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="province">
                        <span className="label-text">{t.forms.province[language]}</span>
                        <select
                            id="province"
                            value={address?.province?.id}
                            onChange={changeProvince}
                            required
                        >
                            {_provinces?.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="country">
                        <span className="label-text">{t.forms.country[language]}</span>
                        <select
                            id="country"
                            value={address?.province?.country?.id}
                            onChange={changeCountry}
                            required
                        >
                            {countries?.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="phone_code">
                        <span className="label-text">{t.forms.phoneCode[language]}</span>
                        <div id="phone_code">{"± " + address?.phone_code?.phone_code || ""}</div>
                    </label>
                </div>
                <div>
                    <label htmlFor="phone_number">
                        <span className="label-text">{t.forms.phoneNumber[language]}</span>
                        <input
                            id="phone_number"
                            type="text"
                            value={address?.phone_number}
                            onChange={changeAddressState}
                            required

                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="email">
                        <span className="label-text">email:</span>
                        <input
                            id="email"
                            type="email"
                            value={address?.email}
                            onChange={changeAddressState}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label id="last-as-primary" htmlFor="as_primary">
                        <input
                            id="as_primary"
                            checked={address?.as_primary}
                            onChange={e => dispatch(setAddress({ ...address, as_primary: e.target.checked }))}
                            type="checkbox"
                        />
                        <span className="label-text">{t.forms.asPrimary[language]}</span>
                    </label>
                </div>
                <div>
                    <button type="submit">{t.forms.submit[language]}</button>
                    <img src={crossBtn} onClick={closeForm} alt="alt-cross-btn" height={20}/>
                </div>
            </form>
        </div>
    )
};

export default EditAddressForm;