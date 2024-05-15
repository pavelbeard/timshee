import React, {useEffect} from 'react';

import "./Menu.css";
import {useDispatch, useSelector} from "react-redux";
import {getCollections} from "../redux/slices/shopSlices/itemSlice";
import {toggleMenuLvl1} from "../redux/slices/menuLvl1Slice";

const MenuLvl1 = () => {
    const dispatch = useDispatch();
    const {collections} = useSelector(state => state.item);

    useEffect(() => {
        dispatch(getCollections());
    }, []);


    return (
        <div className="menu-lvl-1" onMouseLeave={() => dispatch(toggleMenuLvl1())}>
            {collections.length > 0 && collections.map((c) => (
                <div key={c.id}>
                    {c.name}
                </div>
            ))}
        </div>
    )
};

export default MenuLvl1;