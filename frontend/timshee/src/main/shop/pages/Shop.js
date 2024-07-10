import React, {useEffect, useState} from 'react';
import ItemCards from "./components/itemCards/ItemCards";
import {useDispatch, useSelector} from "react-redux";

import "./Shop.css";

import leftArrow from "../../../media/static_images/arrow-left.svg";
import rightArrow from "../../../media/static_images/arrow-right.svg";
import {useNavigate, useParams} from "react-router-dom";
import {getCategories, getColors, getItems, getSizes, getTypes} from "../api/asyncThunks";
import {
    checkColors,
    checkSizes,
    checkTypes,
    resetFilters,
    uncheckColors,
    uncheckSizes, uncheckTypes, updateOrderBy
} from "../api/reducers/shopSlice";
import Loading from "../../techPages/Loading";
import Nothing from "../../techPages/Nothing";
import t from "../../translate/TranslateService";

const Pagination = ({ totalPages, currentPage, setCurrentPage, prevPage, nextPage }) => {
    const pages = [];
    const page = (i) => {
        return (
            <div key={i} disabled={i === currentPage}
                 className={i === currentPage ? "disabled" : "enabled"}
                 onClick={() => setCurrentPage(i)}
            >
                {i}
            </div>
        );
    };

    pages.push(
        <div className="pagination-arrows" key={0} onClick={prevPage}>
            <img src={leftArrow} alt="left-arrow" height={5}/>
        </div>
    );

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 5) {
            if (i === 1 || i === totalPages) {
                pages.push(page(i));
            } else if (i === currentPage){
                pages.push(page(i));
            } else if (i === currentPage + 1 || i === currentPage - 1) {
                pages.push(page(i));
            } else if (i === currentPage + 2 || i === currentPage - 2) {
                pages.push(
                    <div className="span" key={i}><span>...</span></div>
                );
            }
        } else {
            pages.push(page(i));
        }
    }

    pages.push(
        <div className="pagination-arrows" key={totalPages + 1} onClick={nextPage}>
            <img src={rightArrow} alt="right-arrow" height={5}/>
        </div>
    )

    return pages;
};

const Shop = () => {
    window.document.title = "Shop | Timshee";
    const params = useParams();
    const language = t.language();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        filters, genders, sortOrder,
        sizesStatus, sizes,
        colorsStatus, colors,
        typesStatus, types,
        itemsStatus, items,
        pagesCount, totalItemsCount,
    } = useSelector(state => state.shop);
    const {collections, categories} = useSelector(state => state.app);


    const [activeFilter, setActiveFilter] = useState(null);
    const [orderBy, setOrderBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (sizesStatus === 'idle') {
            dispatch(getSizes());
        }

        if (colorsStatus === 'idle') {
            dispatch(getColors());
        }

        if (typesStatus === 'idle') {
            dispatch(getTypes());
        }
    }, []);

    useEffect(() => {
        if (itemsStatus === 'idle' &&
            sizesStatus === 'success' &&
            colorsStatus === 'success' &&
            typesStatus === 'success' /*&&*/
        ) {
            const [gender, collection, category, type] = path();
            dispatch(getItems({
                filters: {
                    gender: gender,
                    collection: collection,
                    category: category,
                    types: [type],
                },
                currentPage: currentPage
            }));

        }
    }, [sizesStatus, colorsStatus]);

    const path = () => {
        const values = params.c.split('+');
        const gender = genders.filter(g => values.includes(g.value)).at(0)?.gender || "";
        const collection = collections.filter(c => values.includes(c.link)).at(0)?.link || "";
        const category = categories.filter(c => values.includes(c.code)).at(0)?.code || "";
        const type = types.filter(c => values.includes(c.code)).at(0)?.code || "";

        return [gender, collection, category, type];
    }

    useEffect(() => {
        const [gender, collection, category] = path();
        const f = {
            sizes: sizes.filter(s => s.checked).map(s => s.value),
            colors: colors.filter(c => c.checked).map(c => c.value),
            category: category,
            orderBy: sortOrder.filter(so => filters.includes(so.name))[0]?.value,
            gender: gender,
            collection: collection,
            types: types.filter(t => t.checked).map(t => t.code),
        };
        dispatch(getItems({
            filters: f,
            currentPage: currentPage,
        }));
    }, [filters, currentPage, params]);

    useEffect(() => {
        const navigationEntries = window.performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
            setCurrentPageLink();
        }
    }, []);

    //next/prev page/curr page
    const setCurrentPageLink = (page) => {
        if (page === 0 || page === undefined) {
            setCurrentPage(1);
            navigate(`/shop/collections/${params.c}`);
        } else {
            setCurrentPage(page);
            navigate(`/shop/collections/${params.c}/page/${page}`);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            navigate(`/shop/collections/${params.c}/page/${currentPage - 1}`);
        }
    };

    const nextPage = () => {
        if (currentPage < pagesCount) {
            setCurrentPage(currentPage + 1);
            navigate(`/shop/collections/${params.c}/page/${currentPage + 1}`);
        }
    }

    const sizesBlock = () => {
        return (
            <div className="filters-container">
                <div className="filters-reset">
                    <span className="selected-1">Selected ({sizes.filter(size => size.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(uncheckSizes())}>Reset</div>
                </div>
                <div className="filters-list" >
                {
                    typeof sizes.map === "function" && sizes?.map((size) => {
                        return (
                            <label key={size.id}>
                                <input
                                    disabled={size.total === 0}
                                    type="checkbox"
                                    checked={size.checked}
                                    value={size.id}
                                    onChange={e => dispatch(checkSizes(parseInt(e.target.value)))}/>
                                <span className="value-name">({size.total}) {size.value}</span>
                            </label>
                        )
                    })
                }
                </div>
            </div>
        )
    };

    const colorsBlock = () => {
        return (
            <div className="filters-container">
                <div className="filters-reset">
                    <span className="selected-1">Selected ({colors.filter(color => color.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(uncheckColors())}>Reset</div>
                </div>
                <div className="filters-list">
                {
                    typeof colors.map === "function" && colors.map((color) => {
                        return (
                            <label key={color.id}>
                                <input
                                    disabled={color.total === 0}
                                    type="checkbox"
                                    checked={color.checked}
                                    value={color.id}
                                    onChange={e => dispatch(checkColors(parseInt(e.target.value)))} />
                                <span className="value-name">({color.total}) {color.value}</span>
                                <div className="value-name" style={{
                                   backgroundColor: `${color.hex}`,
                                }}>
                                </div>
                            </label>
                        )
                    })
                }
                </div>
            </div>
        )
    };

    const typeBlock = () => {
        return (
            <div className="filters-container">
                <div className="filters-reset">
                    <span className="selected-1">Selected ({types.filter(types => types.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(uncheckTypes())}>Reset</div>
                </div>
                <div className="filters-list">
                    {
                    typeof types.map === "function" && types?.map((type) => {
                        return (
                            <label key={type.id}>
                                <input
                                    disabled={type.total === 0}
                                    type="checkbox"
                                    checked={type.checked}
                                    value={type.id}
                                    onChange={e => dispatch(checkTypes(parseInt(e.target.value)))}/>
                                <span className="value-name">({type.total}) {type.value}</span>
                            </label>
                        )
                        })
                    }
                </div>
            </div>
        )
    };

    const turnFilters = (e) => {
        const prohibitedFilters =
            e.target.classList[0] === 'value-name' ||
            e.target.classList[0] === 'selected-1' ||
            e.target.classList[0] === 'filters-list' ||
            e.target.classList[0] === 'filters-container' ||
            e.target.classList[0] ==='filters-reset' ||
            e.target.localName === 'input';
        if (!prohibitedFilters) {
            const filter = e.target.getAttribute("data-filter");
            setActiveFilter(activeFilter === filter ? null : filter);
        }
    };

    return (
        <div className="shop-container" onClick={turnFilters}>
            <div className="collection-name">
                {path().at(1)?.replaceAll('-', ' ').replace(/(\d{4}) (\d{4})/, "$1/$2") || params.c.split('+')[0]}
            </div>
            <div className="settings-container">
                <div className="filters">
                    <label className="labels">{t.shop.filters[language]}</label>
                    <span className="labels" data-filter="size"
                          onClick={turnFilters}>{t.shop.size[language]}
                        {activeFilter === "size" && sizesBlock()}

                    </span>
                    <span className="labels" data-filter="color"
                          onClick={turnFilters}>{t.shop.color[language]}
                        {activeFilter === "color" && colorsBlock()}
                    </span>
                    <span className="labels" data-filter="category"
                          onClick={turnFilters}>{t.shop.type[language]}
                        {activeFilter === "category" && typeBlock()}
                    </span>

                </div>
                <div className="sort-by">
                    <label htmlFor="sort-by">{t.shop.orderBy[language]}
                        <select name="sort-by" id="sort-by" value={orderBy}
                                onChange={e => {
                                    dispatch(updateOrderBy(e.target.value));
                                    setOrderBy(e.target.value)
                                }}>
                            {
                                sortOrder.map((order, index) => (
                                    <option key={index} value={order.value}>{t.shop.orderBy[order.name][language]}</option>
                                ))
                            }
                        </select>
                    </label>
                </div>
                <div className="items-count">{totalItemsCount}</div>
            </div>
            <div className="all-filters-container">
                {
                    typeof filters.map === "function" && filters.map((item, index) => {
                        return <p key={index}>{item}</p>
                    })
                }
                {
                    filters.length > 0 && <div className="reset" onClick={() => {
                        dispatch(resetFilters());
                        setActiveFilter(null);
                        setOrderBy("")
                        setCurrentPageLink();
                    }}>Reset</div>
                }
            </div>
            {
                itemsStatus === 'success' && items.length > 0
                    ? <ItemCards items={items}/>
                    : itemsStatus === 'loading' ? <Loading />
                        : items.length === 0 && <Nothing />
            }
            {
                items.length > 0 && (
                    <div className="pagination">
                    {
                        <Pagination
                            totalPages={pagesCount || 1}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPageLink}
                            prevPage={prevPage}
                            nextPage={nextPage}
                        />
                    }
                    </div>
                )
            }
        </div>
    )
};

export default Shop;