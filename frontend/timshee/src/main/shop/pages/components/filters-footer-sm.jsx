import {Button} from "../../../../components/button";
import {useTranslation} from "react-i18next";
import {clsx} from "clsx";
import {useShopStore} from "../../../../store";

export default function FiltersFooterSm(props) {
    const { t } = useTranslation();
    const { uncheckSizes, uncheckColors, uncheckTypes } = useShopStore();
    const style = clsx(
        'flex mx-6 mb-6 justify-between border-t-[1px] border-gray-200',
        'fixed bottom-0 right-0 left-0',
    )
    return(
        <div className={style}>
            <Button
                className={clsx("mr-3 border-none hover:bg-white hover:text-black hover:outline hover:outline-blue-200")}
                onClick={() => {
                    uncheckSizes();
                    uncheckColors();
                    uncheckTypes();
                }}
            >
                {t('shop:reset')}
            </Button>
            <Button className="ml-3"
            >
                {t('shop:apply')}
            </Button>
        </div>
    )
}