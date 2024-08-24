import Radio from "../../../ui/Radio";
import {useTranslation} from "react-i18next";

export default function Payment() {
    const { t } = useTranslation();
    return(
        <section className="mt-4">
            <div className="flex p-2 justify-between border-[1px] border-gray-200">
                <Radio
                    htmlFor="yookassa"
                    labelText={t('orders.checkout:yookassa')}
                    defaultChecked={true}
                />
            </div>
        </section>
    )
}