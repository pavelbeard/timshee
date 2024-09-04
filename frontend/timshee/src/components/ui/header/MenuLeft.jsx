import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import MenuItemFlat from "./MenuItemFlat";
import {clsx} from "clsx";
import {useSelector} from "react-redux";
import {selectCollections, selectFilters, selectGenders} from "../../../redux/features/store/storeSlice";
import {useMemo} from "react";

export default function MenuLeft() {
    const { t } = useTranslation();
    const { gender } = useParams();
    const g = gender === undefined ? "women" : gender;
    const genders = useSelector(selectGenders);
    const collections = useSelector(selectCollections);
    const subMenu = useMemo(() => collections?.map((item) => ({
        title: item.name,
        url:  `/${g}/shop?collections=${item.link}`
    })), [collections]);

        // {
        //     // COMMENT THIS
        //     title: t('header:unisex'),
        //     url: `/${genders.unisex}/shop`
        // },

    const menuLeft = useMemo(() => [
        {
            title: t('header:women'),
            url: `/${genders.women}/shop`
        },
        {
            title: t('header:men'),
            url: `/${genders.men}/shop`
        },
        {
            title: t('header:collections'),
            url: null,
            subMenu: subMenu
        },
        {
            title: t('header:house'),
            url: null,
            subMenu: [
                {
                    title: t('header:about'),
                    url: '/about',
                }
            ]
        }
    ], [genders, collections, g]);

    const menuItems = useMemo(() => menuLeft.map((item) =>
        <MenuItemFlat key={item.title} item={item} />
    ), [menuLeft]);

    return (
        <nav>
            <ul className='w-full flex justify-start'>{menuItems}</ul>
        </nav>
    );
}