import {Link, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import {useDispatch, useSelector} from "react-redux";
import {selectTotalPrice, selectTotalQuantity} from "../../redux/features/store/cartSlice";
import {useLazyAddItemsToOrderQuery} from "../../redux/features/api/cartApiSlice";
import {selectIsCartMenuOpen, toggleCartMenu} from "../../redux/features/store/uiControlsSlice";

export default function CartFooter() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const totalPrice = useSelector(selectTotalPrice);
    const isCartMenuOpen = useSelector(selectIsCartMenuOpen);
    const totalQuantity = useSelector(selectTotalQuantity);
    const [triggerCheckout] = useLazyAddItemsToOrderQuery();
    const [isPrivacyHaveRead, setIsPrivacyHaveRead] = useState(false);

    const checkout = () => {
        if (totalQuantity > 0 && isPrivacyHaveRead) {
            triggerCheckout().unwrap()
                .then(res => {
                    isCartMenuOpen && dispatch(toggleCartMenu(false));
                    navigate(`/checkout/${res.detail}/address-info`);
                })
                .catch(err => null);
        }
    };

    return (
        <div className="flex pb-16 flex-col border-t-[1px] bg-white">
            <div className="py-2 px-6">
                <p className="roboto-text">{t('cart:taxesAndShipping')}</p>
                <div className="flex">
                    <Checkbox
                        id="privacy"
                        checked={isPrivacyHaveRead}
                        type="checkbox"
                        onChange={e => setIsPrivacyHaveRead(e.target.checked)}
                    />
                    <Link to={`/privacy`}>
                        <span className="pl-1 roboto-text underline underline-offset-4">
                            {t('privacy:privacyText')}
                        </span>
                    </Link>
                </div>


            </div>
            <div className="p-6">
                <Button disabled={!isPrivacyHaveRead} onClick={checkout} className="h-6">
                    {t('cart:checkout')} • {totalPrice}<span>{t('shop:price')}</span>
                </Button>
            </div>
        </div>
    )
}