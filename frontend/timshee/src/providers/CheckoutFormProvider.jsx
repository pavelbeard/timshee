import {createContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useGetOrderQuery, useUpdateOrderMutation} from "../redux/features/api/orderApiSlice";
import {
    useGetAddressesByUserQuery,
    useGetCountriesQuery,
    useGetPhoneCodesQuery,
    useGetProvincesQuery,
    useGetShippingMethodsQuery
} from "../redux/features/api/accountApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentToken, selectCurrentUser} from "../redux/features/store/authSlice";
import Loading from "../pages/Loading";
import {useInput} from "../lib/hooks";
import {useCreatePaymentMutation} from "../redux/features/api/paymentApiSlice";
import {useRefreshQuery} from "../redux/features/api/authApiSlice";
import {selectCurrentAddresses} from "../redux/features/store/accountSlice";

export const CheckoutFormContext = createContext(null);

export const CheckoutFormProvider = ({ children }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { orderId, step } = useParams();

    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const { data: order } = useGetOrderQuery(orderId);
    const [updateOrder] = useUpdateOrderMutation();
    const [paymentMut] = useCreatePaymentMutation();
    const { currentData: countries } = useGetCountriesQuery();
    const { currentData: provinces } = useGetProvincesQuery();
    const { currentData: phoneCodes}  = useGetPhoneCodesQuery();
    const { currentData: shippingMethods}  = useGetShippingMethodsQuery();
    const { currentData: addressesByUser}  = useGetAddressesByUserQuery();
    // const addressesByUser = useSelector(selectCurrentAddresses);

    const isDone = [
        countries,
        provinces,
        phoneCodes,
    ].every(Boolean);

    const title = {
        1: t('orders.checkout:shippingAddress'),
        2: t('orders.checkout:shippingMethod'),
        3: t('orders.checkout:paymentTitle'),
    };
    const formName = {
        1: "shipping_address",
        2: "shipping_method",
        3: "payment",
    };
    const stageName = {
        0: { title: t('orders.checkout:toCart'), link: '/cart' },
        1: { title: t('orders.checkout:toInformation'), link: `/checkout/${orderId}/address-info` },
        2: { title: t('orders.checkout:toShipping'), link: `/checkout/${orderId}/shipping-info` },
        3: { title: t('orders.checkout:toPayment'), link: null },
    };
    const [page, setPage] = useState(1);
    const [_provinces, _setProvinces] = useState([]);
    const [previousAddresses, _] = useState([] || addressesByUser);
    const [formData, reset, setCheckoutData] = useInput('formData', {
        shipping_address: order?.shipping_address || null,
        shipping_method: parseInt(order?.shipping_method?.id) || null,
    });

    useEffect(() => {
        if (isDone) {
            _setProvinces(provinces);
        }
    }, [isDone]);

    useEffect(() => {
        if (step === 'address-info') setPage(1)
        if (step === 'shipping-info') setPage(2)
        if (step === 'payment') setPage(3)
    }, [step]);

    useEffect(() => {
        setCheckoutData({
            ...formData,
            ['shipping_address']: order?.shipping_address,
            ['shipping_method']: parseInt(order?.shipping_method?.id) || null
        })
    }, [order]);

    const setFormData = e => {
        const formName = e.currentTarget.form.name;
        const name = e.target.name;
        const value = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value;

        setCheckoutData({ ...formData, [formName]: { ...formData[formName], [name]: value } })
    };

    const setCountries = e => {
        const countryId = parseInt(e.target.value);
        const formName = e.currentTarget.form.name;
        const newProvinces = provinces.filter(province => province.country.id === countryId);
        const phoneCode = phoneCodes.find(pc => pc.country === countryId);
        _setProvinces(newProvinces);
        setCheckoutData({
            ...formData, [formName]: {
                ...formData[formName], province: newProvinces[0], phone_code: phoneCode
            }
        });
    };

    const setNewProvince = e => {
        const formName = e.currentTarget.form.name;
        const newProvince = provinces.find(p => p.id === parseInt(e.target.value));
        setCheckoutData({ ...formData, [formName]: { ...formData[formName], province: newProvince } });
    };

    const setShippingMethod = e => {
        const formName = e.currentTarget.form.name;
        const methodId = e.currentTarget?.closest('div[id]')?.getAttribute('id');
        setCheckoutData({...formData, [formName]: parseInt(methodId)})
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (page === 1) {
            const shippingAddress = {
                ...formData?.shipping_address,
                province: formData?.shipping_address?.province?.id,
                phone_code: formData?.shipping_address?.phone_code?.country,
            };

            if (user) {
                shippingAddress['email'] = user;
            }

            if (!('as_primary' in formData) && !token) {
                shippingAddress['as_primary'] = true;
            }

            updateOrder({orderId, data: shippingAddress}).unwrap()
                .then(res => {
                    if (res?.shipping_address) {
                        reset('shipping_address')
                        setPage(2)
                        navigate(`/checkout/${orderId}/shipping-info`);
                    }
                })
                .catch(err => console.error(err));
        } else if (page === 2) {
            const shippingMethod = shippingMethods.find(sm => sm.id === formData.shipping_method);
            updateOrder({orderId, data: shippingMethod}).unwrap()
                .then(res => {
                    if (res?.shipping_method) {
                        reset('shipping_method');
                        setPage(3)
                        navigate(`/checkout/${orderId}/payment`);
                    }
                })
                .catch((err => console.error(err)));
        } else if (page === 3) {
            const data = {
                order_id: orderId,
                order_status: "pending_for_pay"
            };

            paymentMut(data).unwrap()
                .then(res => res?.confirmation_url && navigate('/redirect'))
                .catch(err => console.error(err));
        }
    }

    return(
        <CheckoutFormContext.Provider value={{
            user,
            token,
            order,
            shippingMethods,
            page,
            setPage,
            countries,
            _provinces,
            phoneCodes,
            _setProvinces,
            setNewProvince,
            setCountries,
            previousAddresses,
            formData,
            setFormData,
            setShippingMethod,
            title,
            formName,
            stageName,
            handleSubmit
        }}>
            {!isDone ? <Loading /> : children}
        </CheckoutFormContext.Provider>
    )
};