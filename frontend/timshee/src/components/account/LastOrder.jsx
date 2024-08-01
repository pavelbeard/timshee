import {toCamelCase} from "../../lib/stuff";
import {API_URL} from "../../config";
import Button from "../ui/Button";
import React from "react";
import {clsx} from "clsx";
import {useAccountContext} from "../../lib/hooks";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Image from "../ui/Image";
import ToButton from "../ui/ToButton";
import ImageSkeleton from "../skeletons/ui/ImageSkeleton";
import LastOrderOrderItem from "./addresses/LastOrderOrderItem";
import LastOrderReturnedItem from "./addresses/LastOrderReturnedItem";

export default function LastOrder(props) {
    const { t } = useTranslation();
    const { lastOrder, deliveredAt } = useAccountContext();
    const blocksContainer = clsx(
        'flex flex-col justify-items-start h-full w-full',
        'max-sm:pb-2',
        'sm:pb-2'
    );
    const orderFields = clsx(
        'flex justify-between',
        'max-sm:w-full',
        'md:w-2/3',
        'lg:w-2/3',
    );
    const divider = clsx(
        'bg-gray-300 mb-2 h-[0.0825rem]',
    );
    return (
        <div className={blocksContainer} data-last-order="">
            <div className="h-60 mb-4">
                <div className="tracking-widest roboto-medium">{t('account:orders')}</div>
                <div className={divider}></div>
                <section className="h-full min-h-52 overflow-y-auto">
                    {!lastOrder
                        ? <div className="roboto-light">{t('account:noOrders')}</div>
                        : (
                            <>
                                <div className={clsx(orderFields, 'roboto-medium')}>{lastOrder?.order_number}</div>
                                {lastOrder?.status === "completed"
                                    ? (<div className={orderFields}>
                                        <span className="roboto-light">{t('account:deliveredAt')}</span>
                                        <span className="roboto-light">{new Date(deliveredAt).toDateString()}</span>
                                    </div>)
                                    : (lastOrder?.status === "refunded" || lastOrder?.status === "partial_refunded")
                                        ?
                                        <>
                                            <div className={orderFields}>
                                                <span className="roboto-light">{t('account:status')}</span>
                                                <span
                                                    className="roboto-light">{t(`account.orders:${toCamelCase(lastOrder?.status)}`)}</span>
                                            </div>
                                            <div className={orderFields}>
                                                <span className="roboto-light">{t('account:refundedAt')}</span>
                                                <span
                                                    className="roboto-light">{new Date(lastOrder?.updated_at).toDateString()}</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className={orderFields}>
                                                <span className="roboto-light">{t('account:status')}</span>
                                                <span
                                                    className="roboto-light">{t(`account.orders:${toCamelCase(lastOrder?.status)}`)}</span>
                                            </div>
                                            <div className={orderFields}>
                                                <span className="roboto-light">{t('account:updatedAt')}</span>
                                                <span
                                                    className="roboto-light">{new Date(lastOrder?.updated_at).toDateString()}</span>
                                            </div>
                                        </>
                                }

                                {lastOrder?.order_item.length > 0
                                    ? <LastOrderOrderItem lastOrder={lastOrder} />
                                    : <LastOrderReturnedItem lastOrder={lastOrder} />
                                }
                            </>
                        )
                    }
                </section>
            </div>
            <section className="w-1/2">
            <ToButton to={'/account/details/orders'}>
                    {t('account:seeOrders')}
                </ToButton>
            </section>
        </div>
    )
}