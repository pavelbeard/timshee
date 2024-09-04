import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import MenuItemRecursive from "./MenuItemRecursive";
import {clsx} from "clsx";
import {toggleBurgerMenu} from "../../../redux/features/store/uiControlsSlice";
import {selectGenders} from "../../../redux/features/store/storeSlice";
import {useParams, useSearchParams} from "react-router-dom";
import {useCategories} from "../../../lib/hooks";
import {useMemo, useState} from "react";

export default function MenuLeftRecursive({ level, className, openMenus, setOpenMenus }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { gender } = useParams();
    const { collections } = useSelector(s => s.store);
    const [search, _] = useSearchParams();
    const categories = useCategories();
    const genders = useSelector(selectGenders);
    const baseShopUrl = `shop`;
    const currentCollection = search.get('collections') ? `collections=${search.get('collections')}` : '';

    const typesList = (url, types) => {
        return types.map((type, idx) => ({
            cod: `type-${type.code}-${idx}`,
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
            code: `all-${g}`,
            title: t(`header:${g}All`),
            url: `/${g}/shop`,
            close: true,
            closeMenu: () => dispatch(toggleBurgerMenu(false)),
        }];

        return toAllProducts.concat(categories.map((category, idx) => ({
            code: `cat-${category.code}-${idx}`,
            title: category.name,
            url: null,
            disabled: category?.total === 0,
            subMenu: category?.total !== 0 && typesList(`${url}&categories=${category.code}`, category.types),
            close: true,
        })));
    };

    // {
            // COMMENT THIS
            // title: t('header:unisex'),
            // url: `/${genders.unisex}/shop`,
        // },
        // SPLIT TO GENDERS
        // gender !== undefined && {
        //     title: t('header:products'),
        //     url: null,
        //     subMenu: categoriesList(`${gender}/${baseShopUrl}?${currentCollection}`)
        // },

    const menuLeft = [
        {
            code: 'women',
            title: t('header:women'),
            url: gender !== 'women' && `/${genders.women}/shop`,
            openByFirstClick: true,
            // ADD SUBMENU FOR HER
            subMenu: categoriesList(`${gender}/${baseShopUrl}?${currentCollection}`)
        },
        {
            code: 'men',
            title: t('header:men'),
            url: gender !== 'men' && `/${genders.men}/shop`,
            openByFirstClick: true,
            // ADD SUBMENU FOR HIM
            subMenu: categoriesList(`${gender}/${baseShopUrl}?${currentCollection}`)
        },
        {
            code: 'collections',
            title: t('header:collections'),
            url: null,
            subMenu: Array.isArray(collections) && collections?.map((item, idx) => ({
                code: `coll-${item.link}-${idx}`,
                title: item.name,
                url: `/${gender}/shop?collections=${item.link}`,
                closeMenu: () => dispatch(toggleBurgerMenu(false)),
                close: true,
                roboto: true
            }))
        },
        {
            code: 'house',
            title: t('header:house'),
            url: null,
            subMenu: [
                {
                    code: 'about',
                    title: t('header:about'),
                    url: `/about`,
                    closeMenu: () => dispatch(toggleBurgerMenu(false)),
                    close: true,
                    roboto: true
                }
            ]
        },
    ];

    const menuItems = useMemo(() => menuLeft?.map((item, index) =>
        <MenuItemRecursive
            level={level + 1}
            key={index}
            item={item}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
        />
    ), [collections, categories]);
    return <nav className={clsx(className, 'pt-2')}>
        <ul className={clsx("w-full")} data-nav-left="">
            {menuItems}
        </ul>
    </nav>
}