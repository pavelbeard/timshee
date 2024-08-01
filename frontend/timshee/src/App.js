import React from 'react';
import MainComponent from "./MainComponent";
import { store } from "./redux/store";
import { Provider } from "react-redux";


const App = () => {
    return (
        <Provider store={store}>
            <MainComponent />
        </Provider>
    )
}

export default App;