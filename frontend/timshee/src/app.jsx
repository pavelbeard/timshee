import React from 'react';
import Core from "./core";
import store from "./redux/store";
import {Provider} from "react-redux";
import "./i18n";

import "./index.css";

const App = () => {
    return (
        <Provider store={store}>
            <Core />
        </Provider>
    )
}

export default App;