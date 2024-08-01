import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {useTranslation} from "react-i18next";
import {toCamelCase} from "../../../lib/stuff";
import {privateApi} from "../../../lib/api";
import Loading from "../../Loading";
import Error from "../../Error";
import BackButton from "../../../components/ui/BackButton";
import ShowHideButton from "../../../components/ui/ShowHideButton";
import OrderItem from "../../../components/orders/detail/OrderItem";
import ReturnedItem from "../../../components/orders/detail/ReturnedItem";



const OrderDetail = () => {
    const { t } = useTranslation();
    const params = useParams();
    const { isLoading, data: order, error } = useQuery({
        queryKey: ['order.detail'],
        queryFn: async () => {
            const order = await privateApi.get(`/api/order/orders/${params.orderId}/`);
            return order.data;
        }
    });
    const [showHideItems, setShowHideItems] = useState(true);
    const [showHideReturnedItems, setShowHideReturnedItems] = useState(true);

    const shippingAddress = (address) => {
        if (address) return (
            <div className="flex flex-col">
                <span className="roboto-light">{address.province.country.name}</span>
                <span className="roboto-light">{address.postal_code}</span>
                <span className="roboto-light">{address.province.name}</span>
                <span className="roboto-light">{address.city}</span>
                <span className="roboto-light">{`${address.address1}, ${address.address2}`}</span>
            </div>
        );
        return "";
    };

    if (isLoading) {
        return <Loading />;
    } else if (error) {
        return <Error />;
    } else {
        return (
            <div className="mx-6 mb-3 flex flex-col" data-order-detail-container="">
                <BackButton to={`/account/details/orders`}>
                    {t('account:returnToOrders')}
                </BackButton>
                <div className="max-sm:w-full xl:w-9/12 flex flex-col bg-gray-200 p-6">
                    <section className="flex justify-between">
                        <span className="roboto-medium">{t('account:orderNumber')}</span>
                        <span className="roboto-medium">{order?.order_number}</span>
                    </section>
                    <section className="flex justify-between">
                        <span className="roboto-medium">{t('account:status')}</span>
                        <span className="roboto-medium">{t(`account.orders:${toCamelCase(order?.status)}`)}</span>
                    </section>
                    <div className="flex flex-col justify-between">
                        {order?.shipping_method?.price === 0
                            ? <>
                                <span className="roboto-light">{t('account:to')}</span>
                                <span className="roboto-light">Самовывоз</span>
                            </>
                            : <>
                                <span className="roboto-light border-t-2 border-gray-300 my-3">{t('account:to')}</span>
                                <section className="mb-3">{shippingAddress(order?.shipping_address)}</section>
                            </>
                        }
                    </div>
                    {/*SHOW/HIDE*/}
                    <div className="group">
                        <ShowHideButton showHideItems={showHideItems} setShowHideItems={setShowHideItems}>
                            {t(`account.orders:${showHideItems ? 'show' : 'hide'}`)}
                        </ShowHideButton>
                        <OrderItem order={order} showHideItems={showHideItems} />
                    </div>
                    <div className="group">
                        <ShowHideButton showHideItems={showHideReturnedItems} setShowHideItems={setShowHideReturnedItems}>
                            {t(`account.orders:${showHideItems ? 'showReturnedItems' : 'hideReturnedItems'}`)}
                        </ShowHideButton>
                        <ReturnedItem order={order} showHideItems={showHideReturnedItems} />
                    </div>
                </div>
            </div>
        )
    }
};

export default OrderDetail;