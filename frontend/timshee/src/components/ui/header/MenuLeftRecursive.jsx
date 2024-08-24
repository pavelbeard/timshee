import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import MenuItemRecursive from "./MenuItemRecursive";
import {clsx} from "clsx";
import {toggleBurgerMenu} from "../../../redux/features/store/uiControlsSlice";
import {selectGenders} from "../../../redux/features/store/storeSlice";
import {useParams, useSearchParams} from "react-router-dom";
import {useCategories} from "../../../lib/hooks";

export default function MenuLeftRecursive({ className }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { gender } = useParams();
    const { collections } = useSelector(s => s.store);
    const categories = useCategories();
    const [search, _] = useSearchParams();
    const genders = useSelector(selectGenders);
    const baseShopUrl = `shop`;
    const currentCollection = search.get('collections') ? `collections=${search.get('collections')}` : '';

    const typesList = (url, types) => {
        return types.map((type) => ({
            title: type.name,
            url: type?.total === 0 ? null : `${url}&types=${type.code}`,
            roboto: true,
            disabled: type?.total === 0,
            closeMenu: type?.total !== 0 && (() => dispatch(toggleBurgerMenu(false))),
        }))
    };
    const categoriesList = (url=null)  => {
        const g = url.split('/')[0]
        const toAllProducts = [{
            title: t(`header:${g}All`),
            url: `/${g}/shop`,
            close: true,
            closeMenu: () => dispatch(toggleBurgerMenu(false)),
        }];

        return toAllProducts.concat(categories.map((category) => ({
            title: category.name,
            url: null,
            disabled: category?.total === 0,
            subMenu: category?.total !== 0 && typesList(`${url}&categories=${category.code}`, category.types),
            close: true,
        })));
    }

    const menuLeft = [
        {
            title: t('header:women'),
            url: `/${genders.women}/shop`,
        },
        {
            title: t('header:men'),
            url: `/${genders.men}/shop`,
        },
        {
            title: t('header:unisex'),
            url: `/${genders.unisex}/shop`,
        },
        gender !== undefined && {
            title: t('header:products'),
            url: null,
            subMenu: categoriesList(`${gender}/${baseShopUrl}?${currentCollection}`)
        },
        {
            title: t('header:collections'),
            url: null,
            subMenu: Array.isArray(collections) && collections?.map((item) => ({
                title: item.name,
                url: `/${gender}/shop?collections=${item.link}`,
                closeMenu: () => dispatch(toggleBurgerMenu(false)),
                close: true,
                roboto: true
            }))
        },
        {
            title: t('header:house'),
            url: null,
            subMenu: [
                {
                    title: t('header:about'),
                    url: `/about`,
                    closeMenu: () => dispatch(toggleBurgerMenu(false)),
                    close: true,
                    roboto: true
                }
            ]
        },
    ];

    const menuItems = Array.isArray(menuLeft) && menuLeft.map((item, index) =>
        <MenuItemRecursive key={index} item={item} />
    );
    return <nav className={clsx(className, 'pt-2')}>
        <ul className={clsx("w-full")} data-nav-left="">
            {menuItems}
        </ul>
    </nav>
}