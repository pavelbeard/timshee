import React from 'react';
import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import AppLoader from "./AppLoader";
import {store} from "./redux/store";
import {Provider} from "react-redux";

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <Provider store={store}>
            <AppLoader/>
        </Provider>
    </StrictMode>
)