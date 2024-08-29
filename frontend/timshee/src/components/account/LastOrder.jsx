import {toCamelCase} from "../../lib/stuff";
import React from "react";
import {clsx} from "clsx";
import {useTranslation} from "react-i18next";
import ToButton from "../ui/ToButton";
import LastOrderOrderItem from "./addresses/LastOrderOrderItem";
import LastOrderReturnedItem from "./addresses/LastOrderReturnedItem";
import InfoContainer from "./InfoContainer";
import ButtonContainer from "./ButtonContainer";
import BlockContainer from "./BlockContainer";
import Divider from "./Divider";
import Title from "./Title";

export default function LastOrder({ lastOrder, deliveredAt }) {
    const { t } = useTranslation();
    const orderFields = clsx(
        'flex justify-between',
        'max-sm:w-full',
        'md:w-2/3',
        'lg:w-2/3',
    );
    return (
        <BlockContainer data-last-order="">
            <InfoContainer>
                <Title>{t('account:orders')}</Title>
                <Divider />
                <section className="h-full min-h-52 overflow-y-auto">
                    {!lastOrder
                        ? <div className="roboto-light">{t('account:noOrders')}</div>
                        : <div data-last-order="">
                            <div className={clsx(orderFields, 'roboto-medium')}>{lastOrder?.order_number}</div>
                            {lastOrder?.status === "completed"
                                ?
                                <div className={orderFields}>
                                    <span className="roboto-light">{t('account:deliveredAt')}</span>
                                    <span className="roboto-light">{new Date(deliveredAt).toDateString()}</span>
                                </div>
                                : (lastOrder?.status === "refunded" || lastOrder?.status === "partial_refunded")
                                    ?
                                    <div>
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
                                    </div>
                                    :
                                    <div>
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
                                    </div>
                                }
                                {lastOrder?.order_item.length > 0
                                    ? <LastOrderOrderItem lastOrder={lastOrder} />
                                    : <LastOrderReturnedItem lastOrder={lastOrder} />
                                }
                        </div>
                    }
                </section>
            </InfoContainer>
            <ButtonContainer >
                <ToButton to={'/account/details/orders'}>
                    {t('account:seeOrders')}
                </ToButton>
            </ButtonContainer>
        </BlockContainer>
    )
}