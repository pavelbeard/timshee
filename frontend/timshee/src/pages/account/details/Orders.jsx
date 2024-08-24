import React from 'react';
import {useNavigate} from "react-router-dom";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {clsx} from "clsx";
import Nothing from "../../Nothing";
import {useTranslation} from "react-i18next";
import OrderCard from "../../../components/account/orders/OrderCard";
import {useGetOrdersByUserQuery} from "../../../redux/features/api/accountApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentOrders} from "../../../redux/features/store/accountSlice";
import Container from "../../../components/ui/Container";


const Orders = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const ordersList = useSelector(selectCurrentOrders);
    const { currentData } = useGetOrdersByUserQuery();
    const orders = ordersList;
    console.log(orders)
    return(
        <Container data-orders-container="">
            <section className={clsx(
                    'flex w-48 max-sm:w-full items-center justify-start mb-3 cursor-pointer',
                    'hover:text-gray-300',
                )}
                onClick={() => navigate('/account/details')}
            >
                <ArrowLeftIcon strokeWidth="0.5" className={clsx('size-4 mr-3')} />
                <span className="roboto-light">
                    {t('account:returnToAccount')}
                </span>
            </section>
            <section>
            </section>
            <section className={clsx(
                'gap-4',
                'max-sm:flex max-sm:flex-col',
                'sm:grid sm:grid-cols-2',
                'md:grid md:grid-cols-2',
                'lg:grid lg:grid-cols-3',
            )} data-order-cards="">
                {orders?.length > 0
                    ? orders?.map((order, index) => <OrderCard key={index} order={order}/>)
                    : <Nothing reason={t('account.orders:noOrders')}/>
                }
            </section>
        </Container>
    )
};

export default Orders;