import {createBrowserRouter} from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Error from "./pages/Error";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <Error />
    }
]);