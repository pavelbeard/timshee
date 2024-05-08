import Main from "./main/Main.js";
import {Provider, useDispatch} from "react-redux";
import store from "./redux/store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Shop from "./main/shop/Shop";
import React, {useEffect, useState} from "react";
import Login from "./main/account/Login";
import Register from "./main/account/Register";
import Account from "./main/account/Account";
import Addresses from "./main/account/Addresses";
import ItemCards from "./main/shop/ItemCards";
import ItemCard from "./main/shop/ItemCard";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
    const [collectionLinks, setCollectionLinks] = useState([]);

    const getCsrfToken = async () => {
        try {
            await fetch(API_URL + "api/stuff/get-csrf-token/", {
                credentials: "include",
            });
        } catch (e) {
            // console.error(e);
        }
    }

    const getCollectionLinks = async () => {
        try {
            const response = await fetch(API_URL + "api/store/collections/", {
                credentials: "include",
            });
            const json = await response.json();
            setCollectionLinks(json);
        } catch (e) {

        }
    }

    useEffect(() => {
        getCsrfToken();
        getCollectionLinks();
    }, []);

    return(
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />}>
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/shop/:collection/:type/:itemName" element={<ItemCard />} />
                        <Route path="/account/details" element={<Account />} />
                        <Route path="/account/address-book" element={<Addresses />} />
                        <Route path="/account/login" element={<Login />} />
                        <Route path="/account/register" element={<Register />} />
                        <Route path="/account/addresses" element={<Addresses />} />
                        {
                            typeof collectionLinks.map === "function" && collectionLinks.map((item, index) => {
                                return (
                                    <Route
                                        path={`/collections/${item.link}`}
                                        key={index}
                                        element={ <Shop collectionId={item.id} collectionName={item.name} />}
                                    />
                                )
                            })
                        }
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App;