import {useAccountContext} from "../lib/hooks";
import {Outlet} from "react-router-dom";

export default function OrderRouterProvider() {
    const { orders } = useAccountContext();
    return <Outlet context={{ orders }}/>
}