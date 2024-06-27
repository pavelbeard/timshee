import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Error from "../techPages/Error";
import Loading from "../techPages/Loading";
import {deleteWishlistItem, getWishlist} from "./api/reducers/asyncThunks";
import AuthService from "../api/authService";
import Nothing from "../techPages/Nothing";
import {Link} from "react-router-dom";

import "./Wishlist.css";
import t from "../translate/TranslateService";

const API_URL = process.env.REACT_APP_API_URL;

const Wishlist = () => {
    const dispatch = useDispatch();
    const token = AuthService.getCurrentUser();
    const language = t.language();
    const {wishlist, wishlistStatus, getWishlistStatus} = useSelector(
        state => state.wishlist
    );

    useEffect(() => {
        dispatch(getWishlist({token}));
    }, [wishlistStatus]);

    const removeItem = ({wishlistItemId}) => {
        dispatch(deleteWishlistItem({token, wishlistItemId}));
    };

    if (getWishlistStatus === 'success') {
        if (wishlist.length > 0) {
            return (
                <>
                    {
                        !(token?.access) && (<span style={{
                            paddingLeft: "3.3rem",
                        }}>{t.wishlist.saveWL[language]}</span>)
                    }
                    <div className="wishlist-container">
                        {wishlist.map((w, index) => (
                            <div className="wishlist-item" key={index}>
                                <div className="img-container">
                                    <Link to={`${w.stock_link}`}>
                                        <img src={`${API_URL}${w.stock?.item?.image}`} alt={`alt-wishlist-${index}`}
                                             height={256}/>

                                    </Link>
                                </div>
                                <div className="wishlist-item-info">
                                    <div className="wishlist-item-name-price">
                                        <span>{w.stock?.item?.name}</span>
                                        <span>{w.stock?.item?.price}
                                            <span>{t.shop.price[language]}</span></span>
                                    </div>
                                    <span>{w.stock?.size?.value}</span>
                                    <div className="wishlist-item-color">
                                        <span>{w.stock?.color?.name}</span>
                                        <span style={{background: `${w.stock?.color?.hex}`}}></span>
                                    </div>
                                </div>
                                <div className="remove-from-wishlist"
                                     onClick={() => removeItem({wishlistItemId: w.id})}>
                                    <span>{t.itemCardDetail.removeFromWishlist[language]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )
        } else {
            return (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Nothing />
                    <div className="return-to-account">
                        <Link to="/">{t.wishlist.addItemsToWL[language]}</Link>
                    </div>
                </div>
            )
        }
    } if (getWishlistStatus === 'loading'){
        return <Loading />;
    } else if (getWishlistStatus === 'error') {
        return <Error />;
    }
};

export default Wishlist;