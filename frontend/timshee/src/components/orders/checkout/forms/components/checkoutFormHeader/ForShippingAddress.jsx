import {useCheckoutFormContext} from "../../../../../../lib/hooks";
import {useTranslation} from "react-i18next";

export default function ForShippingAddress() {
    const { t } = useTranslation();
    const { order } = useCheckoutFormContext();

    if (order?.shipping_address) {
        const {
            province: { name: provinceName ,country: { name: countryName } },
            postal_code,
            city,
            phone_code: { phone_code },
            phone_number,
            address1,
            address2,
        } = order.shipping_address;

        return (
            <div className="flex justify-between p-2 border-lrb">
                <span>{[
                    countryName,
                    postal_code,
                    provinceName,
                    city,
                    address1,
                    address2,
                    `±${phone_code} ${phone_number}`,
                ].join(', ')}</span>
                <span>{t('orders.checkout:shippingAddress')}</span>
            </div>
        );
    }

    return null;
}