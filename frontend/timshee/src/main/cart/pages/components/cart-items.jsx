import { API_URL } from '../../../../config';
import React from "react";
import AuthService from "../../../api/authService";
import translateService from "../../../translate/TranslateService";
import t from "../../../translate/TranslateService";
import {clsx} from "clsx";
import { useCartStore } from "../../../../store";


const CartItems = () => {
    const token = AuthService.getAccessToken();
    const language = translateService.language();

    const { changeQuantity, deleteCart, cartItems, orderId } = useCartStore();

    const findItem = (itemSrc) => {
        return JSON.parse(localStorage.getItem("items"))
            .filter(item => item.id === itemSrc.stock.item.id)[0];
    };

    const changeQuantityComponent = async (item, increaseStock) => {
        await changeQuantity({itemSrc: item, increaseStock, token, orderId})
    };

    // that one is deleting all items if itemId undefined or one item with an id
    const removeItems = async ({item, stockId = 0}) => {
        if (stockId === 0) {
            await deleteCart({token, hasOrdered: false});
        } else {
            await changeQuantity({itemSrc: item, increaseStock: true, token, quantity: item.quantity});
        }
    };

    const setItemUrl = (item) => {
        return `/shop/collections/${item.stock.item.collection.link}/${item.stock.item.type.name.replace(/ /g, "-").toLowerCase()}`
                        + `/${item.stock.item.name.replace(/ /g, "-").toLowerCase()}`;
    };

    return (
        <div className="lg:h-[600px] md:h-[300px] max-sm:h-[200px] max-md:h-[200px] overflow-y-auto border-b-gray-400 border-b-1px">
            {
                cartItems.map((item, index) => {
                    return (
                        <div className="pl-[30px] pt-[15px] flex" key={index}>
                            <div className="flex pr-3.5 w-1/2">
                                <img
                                    src={API_URL + item.stock.item.image}
                                    alt={`alt-image-${index}`}
                                    className="md:h-[256px] max-md:h-[128px] shrink-0"
                                />
                            </div>
                            <div className="flex flex-col">
                                {/**/}
                                {/*Will have a realization so far*/}
                                {/*<Link to={itemUrl} onClick={*/}
                                {/*    () => {*/}
                                {/**/}
                                {/*        dispatch(setItemData({...findItem(item)}));*/}
                                {/*    }*/}
                                {/*}>{item.stock.item.name}</Link>*/}
                                <div className="mb-2">{item.stock.item.name}</div>
                                <div className="mb-2">{item.stock.item.price}
                                    <span>{t.shop.price[language]}</span></div>
                                <div className="mb-2">{item.stock.size.value}</div>
                                <div className="mb-2">{item.stock.color.name}</div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className={clsx(
                                        "w-6 h-6 flex items-center",
                                        "justify-center rounded-2xl",
                                        "border-black border-[1px]",
                                        'hover:bg-black hover:text-white',
                                        'cursor-pointer',
                                    )}
                                         onClick={() => changeQuantityComponent(item, true)}>-
                                    </div>
                                    <div>{item.quantity}</div>
                                    <div className={clsx(
                                        "w-6 h-6 flex items-center",
                                        "justify-center rounded-2xl",
                                        "border-black border-[1px]",
                                        'hover:bg-black hover:text-white',
                                        'cursor-pointer',
                                    )}
                                         onClick={() => changeQuantityComponent(item, false)}>±
                                    </div>

                                </div>
                                <div className="underline underline-offset-2 cursor-pointer"
                                     onClick={() => removeItems({
                                         stockId: item.stock.id, item
                                     })}>{translateService.cart.remove[language]}</div>
                            </div>
                        </div>
                    )
                })
            }
            {cartItems.length > 0 && (
                <div className="py-[15px] px-[30px] underline underline-offset-2 cursor-pointer"
                    onClick={() => removeItems({})}>
                    {translateService.cart.removeAll[language]}
                </div>
            )}
        </div>
    )
};

export default CartItems;