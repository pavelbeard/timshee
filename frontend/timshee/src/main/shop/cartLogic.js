import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {setHasAdded} from "../../redux/slices/shopSlices/itemSlice";

const csrftoken = Cookies.get("csrftoken");
const API_URL = process.env.REACT_APP_API_URL;

export async function createCart (authorized) {
    const url = [API_URL, authorized ? "api/cart/carts/" : "api/cart/anon-carts/"].join("");
    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    }
    let data;

    if (authorized) {
        data = {
            user: localStorage.getItem("userId"),
        }
    } else {
        data = {
            session: 0,
        }
    }

    if (authorized) {
        headers["Authorization"] = `Token ${localStorage.getItem("token")}`;
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (response.ok) {
            const json = await response.json();

            if (authorized) {
                localStorage.setItem("cartId", json.id);
            } else {
                localStorage.setItem("anonCartId", json.id);
            }

        } else {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}


export async function addItem ({
       increase = false,
       data,
       authorized,
       dispatch
}) {
    let url;
    const itemId = data?.itemId;
    if (!increase)
        url = [API_URL, authorized ? "api/cart/cart-items/" : "api/cart/anon-cart-items/" ].join("");
    else
        url = [API_URL, authorized
            ? `api/cart/cart-items/${itemId}/increase/`
            : `api/cart/anon-cart-items/${itemId}/increase/` ].join("");


    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json"
    }

    if (authorized) {
        headers["Authorization"] = `Token ${localStorage.getItem("token")}`;
    }


    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (response.ok) {
            const json = await response.json();

            if (json.exist) {
                data = {...data, itemId: json.id};
                await addItem({
                    increase: true, data: data, authorized: authorized, dispatch: dispatch
                });
            } else {
                dispatch(setHasAdded(true));
            }
        } else {
            dispatch(setHasAdded(false));
        }

        return true;
    } catch (e) {
        return false;
    }
}