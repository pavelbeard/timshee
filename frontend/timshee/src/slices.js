import {getCountries, getPhoneCodes, getProvinces} from "./lib/global";
import {getSettings} from "./lib/stuff";

export const useLocationSlice = (set) => ({
    error: null,
    countries: [],
    provinces: [],
    phoneCodes: [],
    getCountries: async () => {
        const countries = await getCountries();
        if (!(countries instanceof Error))
        {
            set(() => ({ countries }));
        } else {
            set(() => ({ error: countries.message }));
        }
    },
    getProvinces: async () => {
        const provinces = await getProvinces();
        if (!(provinces instanceof Error)) {
            set(() => ({ provinces }));
        } else {
            set(() => ({ error: provinces.message }));
        }
    },
    getPhoneCodes: async () => {
        const phoneCodes = await getPhoneCodes();
        if (!(phoneCodes instanceof Error)) {
            set(() =>({ phoneCodes }));
        } else {
            set(() => ({ error: phoneCodes.message }));
        }
    },
});

export const useStuffSlice = (set) => ({
    error: null,
    dynamicSettings: null,
    getDynamicSettings: async (token) => {
        const dynamicSettings = await getSettings({token});
        if (!(dynamicSettings instanceof Error)) {
            set(() =>({ dynamicSettings }));
        } else {
            set(() => ({ error: dynamicSettings.message }));
        }
    },
});