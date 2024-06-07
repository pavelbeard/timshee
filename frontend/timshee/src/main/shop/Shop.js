import React, {useEffect, useState} from 'react';
import ItemCards from "./ItemCards";
import {useDispatch, useSelector} from "react-redux";

import "./Shop.css";

import leftArrow from "../../media/static_images/arrow-left.svg";
import rightArrow from "../../media/static_images/arrow-right.svg";
import {useNavigate, useParams} from "react-router-dom";
import {getCategories, getColors, getItems, getSizes} from "./api/asyncThunks";
import {
    checkCategories,
    checkColors,
    checkSizes,
    resetFilters,
    uncheckCategories,
    uncheckColors,
    uncheckSizes, updateOrderBy
} from "./api/reducers/shopSlice";
import Loading from "../Loading";
import Error from "../Error";

const API_URL = process.env.REACT_APP_API_URL;

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

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        filters, genders, sortOrder,
        sizesStatus, sizes,
        colorsStatus, colors,
        categoriesStatus, categories,
        itemsStatus, items,
        pagesCount, totalItemsCount,
    } = useSelector(state => state.shop);

    // a gender or collection
    const vPath = Object.keys(params)[0] === 'gender' ? "g" : "c"


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

        if (categoriesStatus === 'idle') {
            dispatch(getCategories());
        }
    }, []);

    useEffect(() => {
        if (itemsStatus === 'idle' &&
            sizesStatus === 'success' &&
            colorsStatus === 'success' &&
            categoriesStatus === 'success'
        ) {
            dispatch(getItems({
                filters: {
                    gender: Object.keys(params)[0] === 'gender'
                        ? genders.find(g => g.value === params[Object.keys(params)[0]])?.gender
                        : "",
                    collection: Object.keys(params)[0] === 'collection'
                        ? params[Object.keys(params)[0]]
                        : "",
                }
            }));
        }
    }, [sizesStatus, colorsStatus, categoriesStatus]);

    useEffect(() => {
        dispatch(getItems({
            filters: {
                sizes: sizes.filter(s => s.checked).map(s => s.value),
                colors: colors.filter(c => c.checked).map(c => c.value),
                categories: categories.filter(c => c.checked).map(c => c.value),
                orderBy: sortOrder.filter(so => filters.includes(so.name))[0]?.value,
                gender: Object.keys(params)[0] === 'gender'
                        ? genders.find(g => g.value === params[Object.keys(params)[0]])?.gender
                        : "",
                collection: Object.keys(params)[0] === 'collection'
                    ? params[Object.keys(params)[0]]
                    : "",
            },
            currentPage: currentPage,
        }))
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
            navigate(`/shop/collections/${vPath}/${params[Object.keys(params)[0]]}`);
        } else {
            setCurrentPage(page);
            navigate(`/shop/collections/${vPath}/${params[Object.keys(params)[0]]}/page/${page}`);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            navigate(`/shop/collections/${vPath}/${params[Object.keys(params)[0]]}/page/${currentPage - 1}`);
        }
    };

    const nextPage = () => {
        if (currentPage < pagesCount) {
            setCurrentPage(currentPage + 1);
            navigate(`/shop/collections/${vPath}/${params[Object.keys(params)[0]]}/page/${currentPage + 1}`);
        }
    }

    const sizesBlock = () => {
        return (
            <div className="filters-container">
                <div className="filters-reset">
                    <span>Selected ({sizes.filter(size => size.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(uncheckSizes())}>Reset</div>
                </div>
                <div className="filters-list">
                {
                    typeof sizes.map === "function" && sizes?.map((size) => {
                        return (
                            <label key={size.id}>
                                <input
                                    type="checkbox"
                                    checked={size.checked}
                                    value={size.id}
                                    onChange={e => dispatch(checkSizes(parseInt(e.target.value)))} />
                                <span>{size.value}</span>
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
                    <span>Selected ({colors.filter(color => color.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(uncheckColors())}>Reset</div>
                </div>
                <div className="filters-list">
                {
                    typeof colors.map === "function" && colors.map((item) => {
                        return (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    value={item.id}
                                    onChange={e => dispatch(checkColors(parseInt(e.target.value)))} />
                                <span>{item.value}</span>
                                <div style={{
                                   backgroundColor: `${item.hex}`,
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

    const categoryBlock = () => {
        return (
            <div className="filters-container">
                <div className="filters-reset">
                    <span>Selected ({categories.filter(category => category.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(uncheckCategories())}>Reset</div>
                </div>
                <div className="filters-list">
                    {
                    typeof categories.map === "function" && categories?.map((item) => {
                        return (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    value={item.id}
                                    onChange={e => dispatch(checkCategories(parseInt(e.target.value)))} />
                                <span>{item.value}</span>
                            </label>
                        )
                    })
                }
                </div>
            </div>
        )
    };

    const turnFilters = (e) => {
        const filter = e.target.getAttribute("data-filter");
        setActiveFilter(activeFilter === filter ? null : filter);
    };

    return (
        <div className="shop-container">
            <div className="collection-name">
                {params[Object.keys(params)[0]] && params[Object.keys(params)[0]].replaceAll('-', ' ')}
            </div>
            <div className="settings-container">
                <div className="filters">
                    <label className="labels">Filter:</label>
                    <span className="labels" data-filter="size" onClick={turnFilters}>Size:</span>
                    {activeFilter === "size" && sizesBlock()}
                    <span className="labels" data-filter="color" onClick={turnFilters}>Color:</span>
                    {activeFilter === "color" && colorsBlock()}
                    <span className="labels" data-filter="category" onClick={turnFilters}>Category:</span>
                    {activeFilter === "category" && categoryBlock()}
                </div>
                <div className="sort-by">
                    <label htmlFor="sort-by">Order By:
                        <select name="sort-by" id="sort-by" value={orderBy}
                                onChange={e => {
                                    dispatch(updateOrderBy(e.target.value));
                                    setOrderBy(e.target.value)
                                }}>
                            {
                                sortOrder.map((order, index) => (
                                    <option key={index} value={order.value}>{order.name}</option>
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
                items.length > 0 ? <ItemCards items={items}/> : <Loading />
            }
            <div className="pagination">{
                <Pagination
                    totalPages={pagesCount || 1}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPageLink}
                    prevPage={prevPage}
                    nextPage={nextPage}
                />
            }
            </div>
        </div>
    )
};

export default Shop;