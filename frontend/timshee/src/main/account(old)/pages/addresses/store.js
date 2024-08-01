import { create } from "zustand";
import {createAddress, deleteAddress, editAddress, getAddresses} from "../../../../lib/addresses";

export const useAddressesStore = create((set, get) => ({
    address: null,
    addresses: [],
    computed: {
        primaryAddress: () => {
            const addresses = get().addresses;
            if (addresses && addresses.length > 0) {
                return addresses.find(a => a.as_primary) ?? null;
            } else {
                return null;
            }
        }
    },
    isAddressFormOpened: false,
    addAddress: async (token, data) => {
        const address = await createAddress({token, data});
        set((state) => ({ addresses: state.addresses.push(address) }));
    },
    getAddresses: async (token) => {
        const data = await getAddresses({token});
        set({ addresses: data });
    },
    editAddress: async (token, data, addressId) => {
        const address = await editAddress({token, data, addressId});
        set((state) => ({ addresses: state.addresses.map(a => a.id === addressId ? address : a) }));
    },
    deleteAddress: async (token, addressId) => {
        await deleteAddress({token, addressId});
        set((state) => ({ addresses: state.addresses.filter(address => address.id !== addressId) }));
    },
    throwAddress: (addressObject) => set(() => ({ address: addressObject })),
    toggleAddressForm: () => set((state) => ({ isAddressFormOpened: !state.isAddressFormOpened })),
    addressForm: (payload) => set((state) => ({ address: {...state.address, ...payload } })),
}));