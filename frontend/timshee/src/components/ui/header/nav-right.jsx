import React from "react";
import clsx from "clsx";
import MenuItem from "./menu-item";
import SubMenu from "./sub-menu";
import {useTranslation} from "react-i18next";
import {useAuthContext} from "../../../lib/hooks";


export default function NavRight(props) {
    const { t } = useTranslation(['header', 'stuff', 'stuff.forms']);
    const {
        toggleCartMenu, toggleBurgerMenu, wishlist,
        totalQuantityInCart, nav, ul, borderIfScreenBefore1280
    } = props;

    const { token } = useAuthContext();

    return(
        <nav className={clsx(nav)} data-nav-right="">
            {/*LVL1*/}
            <ul className={clsx(ul)}>
                <MenuItem
                    type={'link'}
                    to={`/shipping-methods`}
                    label={t('stuff:shippingMethods')}
                />
                <MenuItem
                    label={t('account')}
                >
                    {token?.access ? (
                        // LVL2
                        <SubMenu>
                            <MenuItem
                                type={'link'}
                                to={`/account/details`}
                                label={t('details')}
                            />
                            <MenuItem
                                type={'link'}
                                to={`/account/details/addresses`}
                                label={t('addressBook')}
                            />
                            <MenuItem
                                type={'link'}
                                to={`/account/details/orders`}
                                label={t('orders')}
                            />
                            <MenuItem
                                type={'link'}
                                to={`/account/details/wishlist`}
                                label={t('wishlist')}
                            />
                        </SubMenu>
                    ) : (
                        <SubMenu>
                            <MenuItem
                                type={'link'}
                                to={`/account/signin`}
                                label={t('stuff.forms:login')}
                            />
                            <MenuItem
                                type={'link'}
                                to={`/account/signup`}
                                label={t('stuff.forms:register')}
                            />
                            <MenuItem
                                type={'link'}
                                to={`/account/details/wishlist`}
                                label={<>{t('wishlist')} <span>({wishlist?.length})</span></>}
                            />
                        </SubMenu>
                    )}
                </MenuItem>
                <MenuItem
                    label={<>{t('cart')} <span>({totalQuantityInCart || 0})</span> </>}
                    onClick={() => {
                        toggleCartMenu();
                        toggleBurgerMenu(true);
                    }}
                />
            </ul>
        </nav>
    )
}