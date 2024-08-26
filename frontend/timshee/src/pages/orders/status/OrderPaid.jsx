import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useSearchParameters, useSendEmail} from "../../../lib/hooks";
import Container from "../../../components/ui/Container";
import {useUpdatePaymentQuery} from "../../../redux/features/api/paymentApiSlice";
import {selectPaymentStatus} from "../../../redux/features/store/paymentSlice";
import {useTranslation} from "react-i18next";
import Button from "../../../components/ui/Button";
import {selectCurrentToken, selectCurrentUser} from "../../../redux/features/store/authSlice";
import {useClearCartMutation} from "../../../redux/features/api/cartApiSlice";
import {useGetOrderQuery} from "../../../redux/features/api/orderApiSlice";
import OrderProcessing from "../../../emails/order-processing";
import ItemImage from "../../../components/ui/ItemImage";
import {API_URL} from "../../../config";

const OrderPaid = () => {
    const { t } = useTranslation();
    const { orderId } = useParams();
    const { get } = useSearchParameters();
    const [sendEmail] = useSendEmail();
    const navigate = useNavigate();
    const orderNumber = get('order_number');
    const paymentStatus = useSelector(selectPaymentStatus);
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);
    const { data: order, isLoading: isOrderLoading } = useGetOrderQuery(orderId);
    const { data: status }= useUpdatePaymentQuery({ orderId, data: paymentStatus.succeeded });
    const [clearCartMut] = useClearCartMutation();
    const orderItems = order?.order_item?.map((item, idx) => {
        const url = `${API_URL}${item?.name}`;
        return <div key={idx}>
            <ItemImage
                src={url}
                alt={`order-item-${idx}`}
            />

        </div>
    })

    useEffect(() => {
        if (status === paymentStatus.succeeded && !isOrderLoading) {
            const to = user || order?.shipping_address?.email;
            const template = <OrderProcessing
                orderNumber={orderNumber}
                orderText={t('orders.checkout:orderInProcessing', { orderNumber })}
                yourItems={t('orders.checkout:yourItems')}
                orderItems={<section>{orderItems}</section>}
            />;
            clearCartMut({ has_ordered: true }).unwrap()
                .then(() => sendEmail(to, `Timshee store | Order ${orderNumber}`, template, null))
                .catch(err => console.error(err));
        }
    }, [status, isOrderLoading]);

    return(
        <Container>
            <div className="flex flex-col justify-center items-center mt-20">
                <h1 className="text-2xl">{t(`orders.checkout:succeeded`, { orderNumber })}</h1>
                <div className="w-1/3">
                    <Button onClick={() => navigate(`/`)}>{t('stuff:backToMain')}</Button>
                    {token && <Button onClick={() => navigate(`/account/details/orders`)}>{t('account:seeOrders')}</Button>}
                </div>
            </div>
        </Container>

    )
};

export default OrderPaid;