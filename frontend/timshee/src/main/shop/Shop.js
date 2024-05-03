import {useEffect, useRef, useState} from "react";
import ItemCards from "./ItemCards";

import "./Shop.css";
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

const API_URL = process.env.REACT_APP_API_URL;


const Shop = ({collectionId, collectionName}) => {
    const dispatch = useDispatch();
    const {sizesData, colorsData, categoriesData, sizes, colors, categories, filters} = useSelector(state => state.filters);

    const [items, setItems] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);

    const [collection, setCollection] = useState(collectionId);

    const [orderBy, setOrderBy] = useState("");

    // for update component


    const getItems = async () => {
        const filterSizes = sizes.length > 0 ? "&sizes__value="
            + sizes.join('&sizes__value=') : "";
        const filterColors = colors.length > 0 ? "&colors__name="
            + colors.join('&colors__name=') : "";
        const filterCategories = categories.length > 0 ? "&type__category__name="
            + categories.join('&type__category__name=') : "";
        const filterOrderBy = "&o=" + orderBy
        const encodedURI = encodeURI(API_URL +
            "api/store/items/" + "?"
                + filterSizes
                + filterColors
                + filterCategories
                + filterOrderBy);

        const response = await fetch(encodedURI);
        const json = await response.json();
        setItems(json.results);
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
    };

    const handleColorChange = (e) => {
        const {value, checked} = e.target;
        const id = parseInt(e.target.getAttribute("data-checkbox-id"));
        dispatch(updateFilters({value, checked}));
        dispatch(updateColorsData({id, value, checked}));
    };

    const handleCategoryChange = (e) => {
        const {value, checked} = e.target;
        const id = parseInt(e.target.getAttribute("data-checkbox-id"));
        dispatch(updateFilters({value, checked}));
        dispatch(updateCategoriesData({id, value, checked}));
    };

    const handleOrderByChange = (e) => {
        e.preventDefault();
        const {value} = e.target;
        setOrderBy(value);
    };

    useEffect(() => {
        getItems();
        getSizes();
        getColors();
        getCategories();
    }, [sizes, colors, categories, filters, orderBy]);

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
                <div className="items-count">{items?.length}</div>
            </div>
            <div className="all-filters-container">
                {
                    typeof filters.map === "function" && filters.map((item, index) => {
                        return <p key={index}>{item}</p>
                    })
                }
                {
                    filters.length > 0 && <div className="reset" onClick={() => {
                        dispatch(resetFilters())
                        setActiveFilter(null);
                    }}>Reset</div>
                }
            </div>
            <ItemCards items={items}/>
        </div>
    )
};

export default Shop;