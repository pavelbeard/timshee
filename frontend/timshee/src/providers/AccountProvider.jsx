import {createContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {useAxiosPrivate} from "../lib/hooks";


export const AccountContext = createContext(null);

export default function AccountProvider ({ children }) {
    const privateApi = useAxiosPrivate();
    const { isLoading: isEmailLoading, data: emailData, error: emailError } = useQuery({
        queryKey: ['account.addresses.email.get'],
        queryFn: async ({ signal }) => {
            const email = await privateApi.get('/api/stuff/profile/get_email/', { signal });
            return email.data;
        },
    })
    const { isLoading, data, error } = useQuery({
        queryKey: ['account.addresses.get'],
        queryFn: async ({ signal }) => {
            const [addresses, orders, lastOrder] = await Promise.allSettled([
                privateApi.get('/api/order/addresses/get_addresses_by_user/', { signal }),
                privateApi.get('/api/order/orders/get_orders_by_user/', { signal }),
                privateApi.get('/api/order/orders/get_last_order_by_user/', { signal })
            ]);

            return {
                addresses: addresses.value?.data || null,
                orders: orders.value?.data || null,
                lastOrder: lastOrder.value?.data || null
            };
        }
    });
    const postAddress = useMutation({
        mutationKey: ['account.addresses.post'],
        mutationFn: async (formData) => {
             const newAddress = await privateApi.post('/api/order/addresses/', formData);
             setAddress(null);
             setAddresses(prev => [...prev, newAddress.data]);
        }
    });
    const changeAddress = useMutation({
        mutationKey: ['account.addresses.put'],
        mutationFn: async (formData) => {
            const changedAddress = await privateApi.put(`/api/order/addresses/${formData.id}/`, formData, );
            setAddress(null);
            setAddresses(prev => prev.map(a => a.id === formData.id ? changedAddress.data : {...a, as_primary: false}));
        }
    });
    const deleteAddress = useMutation({
        mutationKey: ['account.addresses.delete'],
        mutationFn: async (addressId) => {
            await privateApi.delete(`/api/order/addresses/${addressId}/`);
            setAddresses(prev => prev.filter(address => address.id !== addressId));
        }
    });

    // data
    const [address, setAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [lastOrder, setLastOrder] = useState(null);
    const [email, setEmail] = useState("...");
    const [shipTo, setShipTo] = useState("");
    const [for_, setFor] = useState("");
    const [deliveredAt, setDeliveredAt] = useState("");

    // forms controls
    const [isChangeEmailFormOpened, toggleChangeEmail] = useState(false);
    const [isAddressFormOpened, toggleAddressForm] = useState(false);

    useEffect(() => {
        if(data?.addresses && data?.orders) {
            setAddresses(data.addresses);
            setOrders(data.orders);
        }

        if (data?.lastOrder && data?.addresses) {
            setLastOrder(data.lastOrder);
            setPrimaryAddress(data.addresses.find((address) => address.as_primary));
            if (data?.lastOrder?.shipping_address) {
                setShipTo(
                    [
                        `${lastOrder?.shipping_address?.province?.country?.name}, `,
                        `${lastOrder?.shipping_address?.postal_code}, `,
                        `${lastOrder?.shipping_address?.province?.name}, `,
                        `${lastOrder?.shipping_address?.city}, `,
                        `${lastOrder?.shipping_address?.address1}, `,
                        `${lastOrder?.shipping_address?.address2} `
                    ].join("")
                );
                setFor(lastOrder?.shipping_address?.firstName + " " + lastOrder?.shipping_address?.last_name);
            }


            if (lastOrder?.status === "completed") {
                setDeliveredAt(lastOrder?.updated_at)
            }
        }
    }, [data]);

    useEffect(() => {
        if (emailData?.email) {
            setEmail(emailData.email);
        }
    }, [emailData])

    return(
        <AccountContext.Provider value={{
            isLoading, isEmailLoading, error, emailError,
            addresses, primaryAddress, orders, lastOrder, deliveredAt, email,
            privateApi, isChangeEmailFormOpened, toggleChangeEmail,
            isAddressFormOpened, toggleAddressForm,
            address, setAddress,
            postAddress, changeAddress, deleteAddress,
        }}>
            {children}
        </AccountContext.Provider>
    )
}