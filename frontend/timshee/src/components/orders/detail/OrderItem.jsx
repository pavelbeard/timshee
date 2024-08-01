import {clsx} from "clsx";
import Image from "../../ui/Image";
import {API_URL} from "../../../config";
import RefundButton from "../../ui/RefundButton";
import ImageSkeleton from "../../skeletons/ui/ImageSkeleton";
import React from "react";
import {useTranslation} from "react-i18next";

export default function OrderItem({ order, showHideItems }) {
    const { t } = useTranslation();
    return (
        <div className={clsx(
            showHideItems && 'max-sm:hidden',
            'flex max-sm:flex-col overflow-x-auto gap-2 mt-2')}>
            {Array.isArray(order?.order_item)
                ? order?.order_item.map((item, index) => (
                    <div className={clsx(
                        'flex-shrink-0 w-20 h-40',
                        'max-sm:h-80',
                        'xl:w-40 xl:h-[600px]'
                    )} key={index}>
                        <Image
                            className={clsx(
                                item.refund_reason !== null && "brightness-50",
                                'aspect-[3/5] object-cover',
                            )}
                            src={`${API_URL}${item.item.item.image}`}
                            alt={`alt-image-${index}`}/>
                        <div
                            className="flex max-sm:flex-col md:flex-col xl:flex-row justify-between"
                            data-order-detail-price=""
                        >
                            <span className="roboto-light">{item.item.item.name}</span>
                            <span className="roboto-light">{item.item.item.price}
                                <span className="roboto-light">{t('shop:price')}</span>
                                        </span>
                        </div>
                        <div className={clsx(
                            "flex max-sm:flex-col md:flex-col xl:flex-row justify-between",
                            'border-y-[1px] border-gray-300'
                        )} data-order-detail-quantity="">
                            {item.quantity > 0 && <>
                                <span className="roboto-light">{item.quantity}</span>
                            </>}
                        </div>
                        <div className={clsx(
                            "flex max-sm:flex-col md:flex-col xl:flex-row justify-between",
                        )} data-order-detail-size="">
                            <span className="roboto-light">{item.item.size.value}</span>
                        </div>
                        <div className={clsx(
                            "flex max-sm:flex-col md:flex-col xl:flex-row justify-between",
                            'border-y-[1px] border-gray-300'
                        )} data-order-detail-color="">
                            <span className="roboto-light">{item.item.color.name}</span>
                        </div>

                        <div className="pb-2" data-order-detail-refund="">
                            {order.non_refundable === false
                                &&
                                <RefundButton
                                    to={`/orders/${order.second_id}/refund?item_id=${item.item.id}&item_q=${item.quantity}`}>
                                    {t('account:returnItem')}
                                </RefundButton>
                            }
                        </div>
                    </div>
                ))
                :
                Array.from({length: 3}).map((_, index) =>
                    <div className={clsx(
                        'flex-shrink-0 w-20 h-40',
                        'max-sm:h-80'
                    )}>
                        <ImageSkeleton
                            key={index}
                            className={clsx('aspect-[3/5] bg-gray-300 object-cover mt-2')}
                        />
                    </div>
                )
            }
        </div>
    )
}