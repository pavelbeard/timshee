import {clsx} from "clsx";
import CustomSelect from "../forms/CustomSelect";
import ItemsTotal from "./ItemsTotal";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {ShopContext} from "../../../providers/ShopProvider";

export default function FiltersOrderBy(props) {
    const sortOrder = useContext(ShopContext)
    const { t } = useTranslation();
    const { orderBy, setOrderBy, updateOrderBy, robotoText } = props;
    const orderByStyle = clsx(
        'flex',
        'max-sm:flex-col'
    );
    return (
        <div className={clsx(orderByStyle)} data-order-by="">
            <CustomSelect
                htmlFor="sortBy"
                value={orderBy}
                containerClassName={clsx('mr-6')}
                className={clsx(robotoText)}
                selectClassName={clsx('pl-2', 'ml-6')}
                labelText={t('shop:orderByPrice')}
                onChange={e => {
                    updateOrderBy(e.target.value);
                    setOrderBy(e.target.value);
                }}
            >
                {sortOrder.map((order, index) => (
                    <option
                        key={index}
                        value={order.value}
                    >
                        {t(`shop:${order.name}`)}
                    </option>
                ))}
            </CustomSelect>
            <ItemsTotal className={clsx(robotoText)}/>
        </div>
    )
}