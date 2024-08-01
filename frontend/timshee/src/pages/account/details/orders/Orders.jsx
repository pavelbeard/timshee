import React from 'react';
import {Link, useNavigate} from "react-router-dom";

import Loading from "../../../Loading";
import Error from "../../../Error";
import {toCamelCase} from "../../../../lib/stuff";
import Nothing from "../../../Nothing";

import { API_URL } from '../../../../config';
import {useTranslation} from "react-i18next";
import Button from "../../../../components/ui/Button";
import {useAccountContext} from "../../../../lib/hooks";
import OrderCard from "../../../../components/account/orders/OrderCard";
import {clsx} from "clsx";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";


const Orders = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { error, orders, isLoading } = useAccountContext();

    if (isLoading) {
        return <Loading/>;
    } else if (!isLoading) {
        return(
            <div className="min-h-[100vh] mx-6 mb-3" data-orders-container="">
                <section
                    className={clsx(
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
                    {Array.isArray(orders) && orders.length > 0
                        ? orders.map((order, index) =>
                            order.order_item.length > 0 || order.returned_item.length > 0
                            && <OrderCard key={index} order={order}/>
                        )
                        : <Nothing/>
                    }
                </section>
            </div>)
    } else if (error) {
        return <Error/>;
    }
};

export default Orders;