import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {api} from "../api";
import {useDispatch, useSelector} from "react-redux";
import {setToken, setUser} from "../../redux/features/store/authSlice";
import {useSignInMutation, useSignOutMutation} from "../../redux/features/api/authApiSlice";
import {CheckoutFormContext} from "../../providers/CheckoutFormProvider";
import {
    resetCategories,
    resetCollections,
    resetColors, resetOrderBy,
    resetSizes, resetTypes,
    selectErrorObj,
    selectIsError,
    selectIsSuccess,
    selectItemsAreLoading,
    selectItemsObject,
    setError,
    setIsError,
    setIsSuccess,
    setItemsObject,
    setLoading, uncheckAll,
} from "../../redux/features/store/storeSlice";
import {safeArrElAccess} from "../stuff";

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

export const useSignIn = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [signIn, { isLoading, isError, isSuccess }] = useSignInMutation();
    const signin = ( username, password, setError, navigateTo=false ) => {
        signIn({ username, password })
            .unwrap()
            .then(res => {
                dispatch(setToken({ token: res.access }));
                if (navigateTo) {
                    navigate('/');
                }
            })
            .catch((err) => {
                if (err?.status === 400) setError(t('errors:loginError400'))
                if (err?.status === 404) setError(t('errors:loginError404'))
                if (err?.status === 500) setError(t('errors:serverError'))
        });
    };

    return [signin, isLoading, isError, isSuccess];
}

export const useSignOut = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [signOut, { isLoading: isSignOutLoading, error: signOutError }] = useSignOutMutation();
    const signout = async () => {
        try {
            await signOut();
            dispatch(setToken({ token: null}));
            dispatch(setUser({ user: null }));
        } catch (e) {
            if(e?.status === 500) {
                throw new Error(t('errors:serverError'));
            }
        }
    }

    return { signout, isSignOutLoading, signOutError };
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

    const setNewValue = (value) => {
        setValue(value);
    }

    const attributeObj = (inputKey=null) => ({
        value: inputKey ? value[inputKey] : value,
        onChange: e => inputKey
            ? setValue(prev => ({...prev, [e.target.name || e.target.id]: e.target.value}))
            : setValue(e.target.value),
    });

    return [value, reset, setNewValue, attributeObj];
};

export const useSearchParameters = () => {
    const [search, setSearch] = useSearchParams();

    const get = (key) => {
        const all = search.getAll(key);
        return safeArrElAccess(all, 0) || null;
    };

    const set = (key, value) => {
        setSearch(prev => ([...prev.entries(), [key, value]]));
    };

    const remove = (key, value) => {
        // selecting all search params
        const all = search.getAll(key);
        // then, find by item
        const filtered = all.find(v => v === value);
        // then filter them
        setSearch(prev => ([...prev].filter(v => v[1] !== filtered)));
    };

    const replace = (key, value) => {
        const newParams = new URLSearchParams(search.toString());
        newParams.set(key, value);
        setSearch(newParams);
    };

    return { search, get, set, remove, replace };
};

export const useFetchItems = () => {
    const dispatch = useDispatch();
    const { gender } = useParams();
    const [searchParams, _] = useSearchParams();
    const isLoading = useSelector(selectItemsAreLoading);
    const isSuccess = useSelector(selectIsSuccess);
    const isError = useSelector(selectIsError);
    const error = useSelector(selectErrorObj);
    const itemsObject = useSelector(selectItemsObject);

    const buildFilters = () => {
        const filters = { item__gender: gender };
        const params = [
            {
                key: 'sizes',
                filter: 'size__value__in',
            },
            {
                key: 'colors',
                filter: 'color__hex__in',
            },
            {
                key: 'types',
                filter: 'item__type__code__in',
            },
            {
                key: 'collections',
                filter: 'item__collection__link__in',
            },
            {
                key: 'categories',
                filter: 'item__type__category__code__in',
            },
            {
                key: 'o',
                filter: 'o',
            },
            {
                key: 'page',
                filter: 'page',
            }
        ];

        params.forEach(p => {
            const values = searchParams.getAll(p.key);
            if (values?.length > 0) {
                filters[`${p.filter}`] = values;
            }
        });

        return filters;
    };

    const applyFilters = useCallback((apiEndpoint) => {
        const filters = buildFilters();
        const url = `${apiEndpoint}${new URLSearchParams(filters).toString()}`;
        api.get(url)
            .then(res => {
                const data = res.data;
                dispatch(setIsSuccess(true));
                dispatch(setItemsObject({
                    items: data?.results || [],
                    pagesCount: Math.ceil((data?.count || 1) / 9),
                    totalItemsCount: data?.count || 0,
                    totalSizes: data?.sizes || [],
                    totalColors: data?.colors || [],
                    totalTypes: data?.types || [],
                    totalCollections: data?.collections || [],
                    totalCategories: data?.categories || [],
                }));
            })
            .catch(err => {
                dispatch(setIsError(true));
                dispatch(setError(err));
            })
            .finally(() =>
                dispatch(setLoading(false))
            );
    }, [dispatch, gender, searchParams]);

    return { applyFilters, itemsObject, isLoading, isError, error, isSuccess };
};

export const usePagination = (itemsObject) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [_, setSearch] = useSearchParams();

    //next/prev page/
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setSearch(prev => ([...prev.entries(), ['page', currentPage - 1]]));
        }
    };
    const nextPage = () => {
        if (currentPage < itemsObject?.pagesCount) {
            setCurrentPage(currentPage + 1);
            setSearch(prev => ([...prev.entries(), ['page', currentPage + 1]]));
        }
    };

    return [currentPage, setCurrentPage, prevPage, nextPage];
};

export const useResetFilters = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useSearchParams();
    return {
        sizes: () => {
            setSearch(prev => [...prev].filter(v => !search.getAll('sizes').includes(v[1])));
            dispatch(resetSizes());
        },
        colors: () => {
            setSearch(prev => ([...prev].filter(v => !search.getAll('colors').includes(v[1]))));
            dispatch(resetColors());
        },
        types: () => {
            setSearch(prev => ([...prev].filter(v => !search.getAll('types').includes(v[1]))));
            dispatch(resetTypes());
        },
        collections: () => {
            setSearch(prev => ([...prev].filter(v => !search.getAll('collections').includes(v[1]))));
            dispatch(resetCollections());
        },
        categories: () => {
            setSearch(prev => ([...prev].filter(v => !search.getAll('categories').includes(v[1]))));
            dispatch(resetCategories());
        },
        orderBy: () => {
            setSearch(prev => ([...prev].filter(v => !search.getAll('o').includes(v[1]))));
            dispatch(resetOrderBy());
        }
    };
};

export const useResetFiltersAll = () => {
    const dispatch = useDispatch();
    const [_, setSearch] = useSearchParams();
    return () => {
        setSearch(new URLSearchParams());
        dispatch(uncheckAll());
    };
}

export const useCategories = () => {
    const { categories, types } = useSelector(s => s.store);
    const removeCategoryAndCheckedFromType = (type) => {
        const { category, checked, ...rest } = type;
        return rest;
    }
    return categories.map(category => ({
        ...category,
        types: types.filter(type => type.category?.id === category?.id).map(removeCategoryAndCheckedFromType)
    }));
}

export const useClickOutside = (ref) => {
    const [showDialog, setShowDialog] = useState(false);
    const toggleDialog = () => setShowDialog(!showDialog);
    const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setShowDialog(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return [showDialog, toggleDialog];
};

export const useDebounce = (value, delay=500) => {
    const [debouncedValue, setDebouncedValue] = useState(null);
    const timerRef = useRef();

    useEffect(() => {
        timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(timerRef.current);
    }, [value, delay]);

    return debouncedValue;
};

export const useFocus = (pathnameExt) => {
    const { pathname } = useLocation();
    const ref = useRef(null);

    useEffect(() => {
        if (pathnameExt === pathname) {
            ref?.current?.focus();
        }

    }, [pathname]);

    return ref;
}

export const useCheckoutFormContext = () => {
    return useContext(CheckoutFormContext);
};