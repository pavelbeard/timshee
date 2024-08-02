import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {getOrderDetail} from "../../forms/reducers/asyncThunks";
import Loading from "../../../../techPages/Loading";
import Error from "../../../../techPages/Error";

import "../Orders.css";
import t from "../../../../translate/TranslateService";
import {toCamelCase} from "../../../../api/stuff";
import {selectCurrentToken} from "../../../../../redux/services/features/auth/authSlice";
import OrderItem from "./OrderItem";
import ReturnedItem from "./ReturnedItem";

const OrderDetail = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const token = useSelector(selectCurrentToken);
    const language = t.language();
    const {order, orderDetailStatus} = useSelector(state => state.ordersPage);

    const shippingAddress = (address) => {
        return (
            <div>
                <span>{`${address?.province?.country?.name}, ${address?.postal_code}, ${address?.province.name}, ${address?.city}`}</span>
                <br/>
                <span>{`${address?.address1}, ${address?.address2}`}</span>
            </div>
        );
    };

    useEffect(() => {
        dispatch(getOrderDetail({orderId: params.orderId, token}));
    }, []);

    if (orderDetailStatus === 'success') {
        return (
            <>
                {token && <div className="return-to-account">
                    <Link to="/account/details/orders">Вернуться в 'заказы'</Link>
                </div>}
                <div className="order-detail-container">

                    <div className="order-detail-number order-detail-info">
                        <span>{t.account.orderNumber[language]}</span>
                        <span>{order.order_number}</span>
                    </div>
                    <div className="order-detail-status order-detail-info">
                        <span>{t.account.status[language]}</span>
                        <span>{t.account.orders.status[toCamelCase(order.status)][language]}</span>
                    </div>
                    <div className="order-detail-shipping-address order-detail-info">
                        {
                            order?.shipping_method?.price === 0 ? (
                                <>
                                    <span>{t.account.to[language]}</span>
                                    <span>Самовывоз</span>
                                </>
                            ) : (
                                <>
                                    <span>{t.account.to[language]}</span>
                                    {order?.shipping_address ? shippingAddress(order.shipping_address) : "NULL"}
                                </>
                            )
                        }
                    </div>
                    <div className="order-img-block order-img-block-detail ">
                        {order?.order_item?.length > 0 && <OrderItem order={order} language={language} /> }
                        {order?.returned_item?.length > 0 && <ReturnedItem order={order} language={language} /> }
                    </div>
                </div>
            </>
        )
    } else if (orderDetailStatus === 'loading') {
        return <Loading/>;
    } else if (orderDetailStatus === 'error') {
        return <Error/>;
    }
};

export default OrderDetail;