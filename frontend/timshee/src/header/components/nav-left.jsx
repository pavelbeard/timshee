import clsx from "clsx";
import MenuItem from "./menu-item";
import SubMenu from "./sub-menu";
import React from "react";
import {useTranslation} from "react-i18next";

export default function NavLeft(props) {
    const { t } = useTranslation('header');
    const { genders, collections, categories, nav, ul, borderIfScreenBefore1280  } = props;
    return(
        <nav className={clsx(nav)} data-nav-left="">
            {/*LVL1*/}
            <ul className={clsx(ul)}>
                <MenuItem label={t('shop')}>
                    {/*LVL2*/}
                    <SubMenu>
                        {/*COLLECTIONS -> GENDERS -> CATEGORIES*/}
                        <MenuItem label={collections[0]?.name}>
                            {/*LVL3*/}
                            <SubMenu className={clsx(borderIfScreenBefore1280)} >
                                <MenuItem
                                    type={'link'}
                                    to={`/shop/collections/${genders[0].value}+${collections[0]?.link}`}
                                    label={t('women')}
                                >
                                    {/*LVL4*/}
                                    <SubMenu>
                                        {Array.isArray(categories) && categories.map((category, index) => {
                                            const linkTo =
                                                `/shop/collections/${genders[0].value}` +
                                                `+${collections[0]?.link}` +
                                                `+${category.code}`;
                                            return(
                                                <MenuItem
                                                    type={'link'}
                                                    to={linkTo}
                                                    key={index}
                                                    label={category.name}
                                                />
                                            )
                                        })}
                                    </SubMenu>
                                </MenuItem>
                                <MenuItem
                                    type="link"
                                    to={`/shop/collections/${genders[1].value}+${collections[0]?.link}`}
                                    label={t('men')}
                                >
                                    {/*LVL4*/}
                                    <SubMenu>
                                        {Array.isArray(categories) && categories.map((category, index) => {
                                            const linkTo =
                                                `/shop/collections/${genders[1].value}` +
                                                `+${collections[0]?.link}` +
                                                `+${category.code}`;
                                            return(
                                                <MenuItem
                                                    type={'link'}
                                                    to={linkTo}
                                                    key={index}
                                                    label={category.name}
                                                />
                                            )
                                        })}
                                    </SubMenu>
                                </MenuItem>
                                <MenuItem
                                    type="link"
                                    to={`/shop/collections/${genders[2].value}+${collections[0]?.link}`}
                                    label={t('unisex')}
                                >
                                    {/*LVL4*/}
                                    <SubMenu>
                                        {Array.isArray(categories) && categories.map((category, index) => {
                                            const linkTo =
                                                `/shop/collections/${genders[2].value}` +
                                                `+${collections[0]?.link}` +
                                                `+${category.code}`;
                                            return(
                                                <MenuItem
                                                    type={'link'}
                                                    to={linkTo}
                                                    key={index}
                                                    label={category.name}
                                                />
                                            )
                                        })}
                                    </SubMenu>
                                </MenuItem>
                            </SubMenu>
                        </MenuItem>
                        {/*GENDERS -> CATEGORIES*/}
                        <MenuItem
                            type="link"
                            to={`/shop/collections/${genders[0].value}`}
                            label={t('women')}
                        >
                            {/*LVL3*/}
                            <SubMenu className={clsx(borderIfScreenBefore1280)} >
                                {Array.isArray(categories) && categories.map((category, index) => (
                                    <MenuItem
                                        type={'link'}
                                        to={`/shop/collections/${genders[0].value}+${category.code}`}
                                        label={category.name}
                                        key={index}
                                    />
                                ))}
                            </SubMenu>
                        </MenuItem>
                        <MenuItem
                            type="link"
                            to={`/shop/collections/${genders[1].value}`}
                            label={t('men')}
                        >
                            {/*LVL3*/}
                            <SubMenu className={clsx(borderIfScreenBefore1280)} >
                                {Array.isArray(categories) && categories.map((category, index) => (
                                    <MenuItem
                                        type={'link'}
                                        to={`/shop/collections/${genders[1].value}+${category.code}`}
                                        label={category.name}
                                        key={index}
                                    />
                                ))}
                            </SubMenu>
                        </MenuItem>
                        <MenuItem
                            type="link"
                            to={`/shop/collections/${genders[2].value}`}
                            label={t('unisex')}
                        >
                            {/*LVL3*/}
                            <SubMenu className={clsx(borderIfScreenBefore1280)} >
                                {Array.isArray(categories) && categories.map((category, index) => (
                                    <MenuItem
                                        type={'link'}
                                        to={`/shop/collections/${genders[2].value}+${category.code}`}
                                        label={category.name}
                                        key={index}
                                    />
                                ))}
                            </SubMenu>
                        </MenuItem>
                    </SubMenu>
                </MenuItem>
                <MenuItem label={t('collections')}>
                    {/*LVL2*/}
                    <SubMenu>
                        {/*COLLECTIONS*/}
                        <MenuItem
                            type={'link'}
                            to={`/shop/collections/${collections[0]?.link}`}
                            label={collections[0]?.name}
                        />
                    </SubMenu>
                </MenuItem>
                <MenuItem
                    type="link"
                    to={`/house`}
                    label={t('house')}
                />
                <MenuItem
                    type="link"
                    to={`/about`}
                    label={t('about')}
                />
            </ul>
        </nav>
    )
}