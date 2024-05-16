import React, {useEffect, useState} from 'react';
import ItemCards from "./ItemCards";
import {useDispatch, useSelector} from "react-redux";
import {
    resetCategoriesData,
    resetColorsData, resetFilters,
    resetSizeData, setCategoriesData,
    setColorsData,
    setSizeData, updateCategoriesData,
    updateColorsData, updateFilters,
    updateSizeData
} from "../../redux/slices/shopSlices/filtersSlice";

import "./Shop.css";

import leftArrow from "../../media/static_images/arrow-left.svg";
import rightArrow from "../../media/static_images/arrow-right.svg";
import {useNavigate} from "react-router-dom";

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

const Shop = ({collectionId, collectionName}) => {
    window.document.title = "Shop | Timshee";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {sizesData, colorsData, categoriesData, sizes, colors, categories, filters} = useSelector(state => state.filters);

    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [activeFilter, setActiveFilter] = useState(null);

    const [orderBy, setOrderBy] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    //next/prev page/curr page
    const setCurrentPageLink = (page) => {
        if (page === 0 || page === undefined) {
            setCurrentPage(1);
            navigate(`/shop/`);
        } else {
            setCurrentPage(page);
            navigate(`/shop/page/${page}`);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            navigate(`/shop/page/${currentPage - 1}`);
        }
    };

    const nextPage = () => {
        if (currentPage < pagesCount) {
            setCurrentPage(currentPage + 1);
            navigate(`/shop/page/${currentPage + 1}`);
        }
    }

    // for update component
    const getItems = async () => {
        const filterSizes = sizes.length > 0 ? "&sizes__value="
            + sizes.join('&sizes__value=') : "";
        const filterColors = colors.length > 0 ? "&colors__name="
            + colors.join('&colors__name=') : "";
        const filterCategories = categories.length > 0 ? "&type__category__name="
            + categories.join('&type__category__name=') : "";
        const filterOrderBy = "&o=" + orderBy
        const encodedURI = encodeURI(API_URL
                + `api/store/items/?${currentPage === 1 ? "" : `page=${currentPage}`}`
                + filterSizes
                + filterColors
                + filterCategories
                + filterOrderBy);

        const response = await fetch(encodedURI);
        const json = await response.json();
        setPagesCount(Math.ceil(json.count / 9));
        setItems(json.results);
        setTotalItems(json.count);
        localStorage.setItem("items", JSON.stringify(json.results));
    };

    const getSizes = async () => {
        const response = await fetch(API_URL + "api/store/sizes/");
        const json = await response.json();

        const newSizes = [];
        json.forEach((item) => {
            newSizes.push({id: item.id, value: item.value, checked: false});
        })

        if (sizes.length === 0) {
            dispatch(setSizeData(newSizes));
        }
    };

    const getColors = async () => {
        const response = await fetch(API_URL + "api/store/colors/");
        const json = await response.json();

        const newColors = [];
        json.forEach((item) => {
            newColors.push({id: item.id, value: item.name, hex: item.hex, checked: false});
        })

        if (colors.length === 0) {
            dispatch(setColorsData(newColors));
        }
    };

    const getCategories = async () => {
        const response = await fetch(API_URL + "api/store/categories/");
        const json = await response.json();

        const newCategories = [];
        json.forEach((item) => {
            newCategories.push({id: item.id, value: item.name, checked: false});
        });

        if (categories.length === 0) {
            dispatch(setCategoriesData(newCategories));
        }
    };

    const handleSizeChange = (e) => {
        const {value, checked} = e.target;
        const id = parseInt(e.target.getAttribute("data-checkbox-id"));
        dispatch(updateFilters({value, checked}));
        dispatch(updateSizeData({ id, value, checked }));
        setCurrentPageLink();
    };

    const handleColorChange = (e) => {
        const {value, checked} = e.target;
        const id = parseInt(e.target.getAttribute("data-checkbox-id"));
        dispatch(updateFilters({value, checked}));
        dispatch(updateColorsData({id, value, checked}));
        setCurrentPageLink();
    };

    const handleCategoryChange = (e) => {
        const {value, checked} = e.target;
        const id = parseInt(e.target.getAttribute("data-checkbox-id"));
        dispatch(updateFilters({value, checked}));
        dispatch(updateCategoriesData({id, value, checked}));
        setCurrentPageLink();
    };

    const handleOrderByChange = (e) => {
        e.preventDefault();
        const {value} = e.target;
        setOrderBy(value);
    };

    useEffect(() => {
        const navigationEntries = window.performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
            setCurrentPageLink();
        }
    }, []);

    useEffect(() => {
        getItems();
        getSizes();
        getColors();
        getCategories();

    }, [sizes, colors, categories, filters, orderBy, currentPage]);

    const sizesBlock = () => {
        return (
            <div className="filters-container">
                <div className="filters-reset">
                    <span>Selected ({sizesData.filter(item => item.checked).length})</span>
                    <div className="reset" onClick={() => dispatch(resetSizeData())}>Reset</div>
                </div>
                <div className="filters-list">
                {
                    typeof sizesData.map === "function" && sizesData?.map((item) => {
                        return (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    data-checkbox-id={item.id}
                                    checked={item.checked}
                                    value={item.value}
                                    onChange={handleSizeChange}
                                />
                                <span>{item.value}</span>
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
                    <span>Selected ({colors.length})</span>
                    <div className="reset" onClick={() => dispatch(resetColorsData())}>Reset</div>
                </div>
                <div className="filters-list">
                {
                    typeof colorsData.map === "function" && colorsData.map((item) => {
                        return (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    data-checkbox-id={item.id}
                                    checked={item.checked}
                                    value={item.value}
                                    onChange={handleColorChange}
                                />
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
                    <span>Selected ({categories.length})</span>
                    <div className="reset" onClick={() => dispatch(resetCategoriesData())}>Reset</div>
                </div>
                <div className="filters-list">
                    {
                    typeof categoriesData.map === "function" && categoriesData?.map((item) => {
                        return (
                            <label key={item.id}>
                                <input
                                    type="checkbox"
                                    data-checkbox-id={item.id}
                                    checked={item.checked}
                                    value={item.value}
                                    onChange={handleCategoryChange}
                                />
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
            <div className="collection-name">{collectionName}</div>
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
                        <select name="sort-by" id="sort-by" defaultValue="" onChange={handleOrderByChange}>
                            <option value="">---</option>
                            <option value="price">ascending</option>
                            <option value="-price">descending</option>
                        </select>
                    </label>
                </div>
                <div className="items-count">{totalItems }</div>
                {/*<div className="items-count">{items?.length}</div>*/}
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
            <ItemCards items={items}/>
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