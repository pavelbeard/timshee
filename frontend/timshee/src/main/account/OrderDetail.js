import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getLastOrder, getOrderDetail} from "./forms/reducers/asyncThunks";

const OrderDetail = () => {
    const dispatch = useDispatch();
    const params = useParams();


    useEffect(() => {
        dispatch(getOrderDetail({orderId: params.orderId}));
    }, []);

    return(
        <></>
    )
};

export default OrderDetail;