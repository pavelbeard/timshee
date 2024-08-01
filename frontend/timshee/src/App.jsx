import React from 'react';
import Core from "./Core";
import AuthenticationProvider from "./providers/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./i18n";

import "./index.css";

const query = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={query}>
            <AuthenticationProvider>
                <Core />
            </AuthenticationProvider>
            {/*<ReactQueryDevtools initialIsOpen={false}  />*/}
        </QueryClientProvider>
    )
}

export default App;