import {useEffect, useState} from "react";
import ItemCard from "./ItemCard";

const API_URL = process.env.REACT_APP_API_URL;

const Shop = ({ collectionId, collectionName }) => {
    const [items, setItems] = useState([]);
    const [sizesList, setSizesList] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colorsList, setColorsList] = useState([]);
    const [colors, setColors] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collection, setCollection] = useState(collectionId);

    const getItems = async () => {
        const filterSizes = sizes.length > 0 ? "&sizes=" + sizes.join('&sizes=') : "";
        const filterColors = colors.length > 0 ? "&colors=" + colors.join('&colors=') : "";
        const filterCategories = categories.length > 0 ? "&categories=" + categories.join('&categories=') : "";

        const response = await fetch(API_URL +
            "api/store/items/" + "?"
                + filterSizes
                + filterColors
                + filterCategories
        );
        const json = await response.json();
        setItems(json.results);
    }

    const getSizes = async () => {
        const response = await fetch(API_URL + "api/store/sizes/");
        const json = await response.json();
        setSizesList(json)
    };

    const getColors = async () => {
        const response = await fetch(API_URL + "api/store/colors/");
        const json = await response.json();
        setColorsList(json);
    }

    const getCategories = async () => {
        const response = await fetch(API_URL + "api/store/categories/");
        const json = await response.json();
        setCategoriesList(json);
    }

    const handleSizeChange = (e) => {
        const {value} = e.target;
        setSizes(prevSizes =>
            prevSizes.includes(value)
                ? prevSizes.filter(size => size !== value)
                : [...prevSizes, value]
        );
    }
    const handleColorChange = (e) => {
        const {value} = e.target;
        setColors(prevColors =>
            prevColors.includes(value)
                ? prevColors.filter(color => color !== value)
                : [...prevColors, value]
        );
    }

    const handleCategoryChange = (e) => {
        const {value} = e.target;
        setCategories(prevCategories =>
            prevCategories.includes(value)
                ? prevCategories.filter(category => category !== value)
                : [...prevCategories, value]
        );
    }

    useEffect(() => {
        getItems();
        getSizes();
        getColors()
        getCategories();

    }, [sizes, colors]);

    return (
        <div className="shop-container">
            <div className="collection-name">{collectionName}</div>
            <div>
                Size:
                {
                    sizesList.map((item, index) => {
                        return (
                            <label key={index}>
                                {item.value}
                                <input
                                    key={index * 3}
                                    type="checkbox" value={item.value}
                                    onChange={handleSizeChange}
                                />
                            </label>
                        )
                    })
                }
            </div>
            <div>
                Color:
                {
                    colorsList.map((item, index) => {
                        return(
                            <label key={index}>
                                {item.name}
                                <input
                                    key={index * 4}
                                    type="checkbox"
                                    value={item.hex.substring(1)}
                                    onChange={handleColorChange}
                                />
                            </label>
                        )
                    })
                }
            </div>
            <div>
                Category:
                {
                    categoriesList?.map((item, index) => {
                        return(
                            <label key={index}>
                                {item.name}
                                <input
                                    key={index * 5}
                                    type="checkbox"
                                    value={item.name.substring(1)}
                                    onChange={handleCategoryChange}
                                />
                            </label>
                        )
                    })
                }
            </div>
            <ItemCard items={items} />
        </div>
    )
};

export default Shop;