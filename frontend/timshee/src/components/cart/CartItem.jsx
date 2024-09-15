import {Link, useParams} from "react-router-dom";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {
    useChangeQuantityMutation,
    useRemoveCartItemMutation
} from "../../redux/features/api/cartApiSlice";
import {clsx} from "clsx";
import {useTranslation} from "react-i18next";
import ItemImage from "../ui/ItemImage";
import {useState} from "react";

export default function CartItem({ cartItem }) {
    const { t } = useTranslation();
    const { gender } = useParams();
    const [changeQuantityMut] = useChangeQuantityMutation();
    const [removeFromCart] = useRemoveCartItemMutation();
    const [addBtnDisabled, setAddBtnDisabled] = useState(false);
    const changeQuantity = e => {
        const increase = e.currentTarget?.getAttribute('data-increase') || false;
        const stockId = e.currentTarget?.closest('[data-cart-item-id]')?.getAttribute('data-cart-item-id');
        changeQuantityMut({
            stock_id: stockId,
            increase,
            quantity: 1
        }).unwrap()
            .catch(err => err?.status === 400 && setAddBtnDisabled(true));
    }

    const remove = e => {
        const stockId = e.currentTarget?.closest('[data-cart-item-id]')?.getAttribute('data-cart-item-id');
        removeFromCart({
            stock_id: stockId,
        }).unwrap()
            .catch(err => null);
    };

    const itemLink = (stock_item) =>
        `/${gender}/shop/products/${stock_item?.item?.id}` +
        `?size=${stock_item?.size?.value}` +
        `&color=${stock_item?.color?.name}`;

    return (
        <div className="flex justify-center p-6">
            <section className="flex flex-col w-full lg:flex-row" data-cart-item-id={cartItem?.stock_item?.id}>
                <Link
                    to={itemLink(cartItem?.stock_item)}
                    data-cart-item-image=""
                >
                    <ItemImage
                        className="lg:h-80 lg:w-full"
                        src={`${cartItem?.stock_item?.item?.image}`}
                        alt={`cart-item-${cartItem.id}`}
                    />
                </Link>
                <div className="lg:ml-4" data-cart-item="">
                    <section className="flex flex-col" data-cart-item-info="">
                        <div className="flex justify-between p-1">
                            <span className="roboto-text">{cartItem?.stock_item?.item?.name}</span>
                            <span className="roboto-text">{cartItem?.stock_item?.item?.price}</span>
                        </div>
                        <div className="flex justify-between lg:flex-col p-1">
                            <span className="roboto-text">{cartItem?.stock_item?.size?.value}</span>
                            <span className="roboto-text">{cartItem?.stock_item?.color?.name}</span>
                        </div>
                    </section>
                    <section className="flex justify-between items-center" data-cart-item-quantity-panel="">
                        <button onClick={changeQuantity} className="group">
                            <MinusCircleIcon
                                strokeWidth="0.5"
                                className="size-6 group-hover:fill-gray-200 group-hover:text-gray-600 group-hover:stroke-1"
                            />
                        </button>
                        <span className="roboto-text-medium">{cartItem?.quantity}</span>
                        <button
                            data-increase="true"
                            className="group"
                            onClick={changeQuantity}
                            disabled={cartItem?.stock_item?.in_stock === 0 || addBtnDisabled}
                        >
                            <PlusCircleIcon strokeWidth="0.5" className={clsx(
                                'size-6',
                                cartItem?.stock_item?.in_stock === 0 || addBtnDisabled
                                    ? 'fill-gray-200 pointer-events-none'
                                    : 'group-hover:fill-gray-200 group-hover:text-gray-600 group-hover:stroke-1'
                            )}/>
                        </button>
                    </section>
                    <section className="lg:flex lg:justify-center" data-delete-item-panel="">
                        <button onClick={remove} className="underlined-button">{t('cart:remove')}</button>
                    </section>
                </div>
            </section>
        </div>
    );
}