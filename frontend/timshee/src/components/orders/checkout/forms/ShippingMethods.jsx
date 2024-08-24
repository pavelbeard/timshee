import {useCheckoutFormContext} from "../../../../lib/hooks";
import {useTranslation} from "react-i18next";
import {clsx} from "clsx";
import Radio from "../../../ui/Radio";

export default function ShippingMethods() {
    const { t } = useTranslation();
    const { shippingMethods, formData, setShippingMethod } = useCheckoutFormContext();

    const shippingMethodsElements = shippingMethods?.map((method, idx) => (
        <div key={idx} id={method.id} className={clsx(
            'flex p-2 justify-between',
            idx !== shippingMethods.length - 1 && 'border-b-[1px] border-gray-200'
        )}>
            <Radio
                htmlFor="shipping_method"
                labelText={method.shipping_name}
                checked={parseInt(method.id) === (formData?.shipping_method || shippingMethods[0].id)}
                onChange={setShippingMethod}
            />
            <span>{method.price}{t('shop:price')}</span>
        </div>
    ))

    return(
        <div className="mt-4 border-[1px] border-gray-200">{shippingMethodsElements}</div>
    )
}