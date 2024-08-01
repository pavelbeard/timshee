import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useShopStore} from "../../store";
import {AuthenticationContext} from "../../providers/AuthenticationProvider";
import {AccountContext} from "../../providers/AccountProvider";
import {refresh} from "../auth";
import {api, privateApi} from "../api";
import {SendMailsContext} from "../../providers/SendMailsProvider";
import {ShopContext} from "../../providers/ShopProvider";


export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    return windowSize;
};

export const useItemUrl = () => {
    const params = useParams();
    const collections = useShopStore(s => s.collections);

    return (item) => {
        // const g = genders.find(i => i.gender === item.gender);
        // const gender = params.c.split('+').includes(g.value)
        //     ? "" : `${g.value}+`;
        // const c = collections?.find(i => i.link === item.collection.link);
        // const collection = params.c.split('+').includes(c?.link)
        //     ? "" : `${c?.link}+`;
        // return  `/shop/collections/${gender}${collection}${params.c}/${item.type.name.replace(/ /g, "-").toLowerCase()}`
        //     + `/${item.id}/${item.name.replace(/ /g, "-").toLowerCase()}`;
    };
};

export const useShopFilters = () => {
    const params = useParams();
    // const collections = useShopStore(s => s?.collections || []);
    // const categories = useShopStore(s => s?.categories || []);
    // const types = useShopStore(s => s?.types || []);
    //
    // return () => {
    //     const values = params.c.split('+');
    //     const gender = genders?.filter(g => values.includes(g.value)).at(0)?.gender || "";
    //     const collection = collections?.filter(c => values.includes(c.link)).at(0)?.link || "";
    //     const category = categories?.filter(c => values.includes(c.code)).at(0)?.code || "";
    //     const type = types.filter(c => values.includes(c.code)).at(0)?.code || "";
    //
    //     return { gender, collection, category, type };
    // };
};

export const useAuthContext = () => {
    return useContext(AuthenticationContext);
};

export const useAccountContext = () => {
    return useContext(AccountContext);
};

export const useShopContext = () => {
    return useContext(ShopContext);
}

export const useMailsSenderContext = () => {
    return useContext(SendMailsContext);
}

export const useRefreshToken = () => {
    const { setToken } = useAuthContext();

    const refreshToken = async () => {
        const accessToken = await privateApi.post('/api/stuff/token/refresh/');
        setToken(prev => ({ ...prev, access: accessToken.data.access }));
        return accessToken.data.access;
    }
    return refreshToken;
};

export const useAxiosPrivate = () => {
    const refreshToken = useRefreshToken();
    const { token, setToken } = useAuthContext();

    useEffect(() => {
        const requestInterceptor = privateApi.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token?.access}`;
                }
                return config;
            }, (error) => Promise.reject(error));

        const responseInterceptor = privateApi.interceptors.response.use(response => response,
            async (error) => {
                const prevRequest = error?.config;
                if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refreshToken();
                    console.log('useAxiosPrivate', newAccessToken);
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken?.access}`;
                    setToken(prev => ({ ...prev, access: newAccessToken?.access }));
                    return privateApi(prevRequest);
                }
                return Promise.reject(error);
            });

        return () => {
            privateApi.interceptors.request.eject(requestInterceptor);
            privateApi.interceptors.response.eject(responseInterceptor);
        }
    }, [refreshToken, token, setToken]);

    return privateApi;
};

export const useSignOut = () => {
    const { setToken } = useAuthContext();
    const signOut = async () => {
        setToken({access: ""})
        try {
            await privateApi.post("/api/stuff/signout/", { withCredentials: true });
        } catch (e) {
            console.error(e);
        }
    }

    return signOut;
};

const getLocalValue = (key, initialValue) => {
    if (typeof window === "undefined") return initialValue;

    const localValue = JSON.parse(localStorage.getItem(key));
    if (localValue) return localValue;

    if (initialValue instanceof Function) return initialValue();

    return initialValue;
};

export const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => getLocalValue(key, initValue));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export const useInput = (key, initialValue) => {
    const [value, setValue] = useLocalStorage(key, initialValue);

    const reset = () => {
        setValue(initialValue);
        localStorage.removeItem(key);
    };

    const attributeObj = (inputKey=null) => ({
        value: inputKey ? value[inputKey] : value,
        onChange: e => inputKey
            ? setValue(prev => ({...prev, [e.target.name || e.target.id]: e.target.value}))
            : setValue(e.target.value),
    });

    return [value, reset, attributeObj];
};

export const useOrder = (orderId) => {
    const orders = useAccountContext()?.orders;
    const order = orders?.find((order) => order.id === parseInt(orderId));
    return order;
}