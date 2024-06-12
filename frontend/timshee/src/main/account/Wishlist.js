import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Error from "../Error";
import Loading from "../Loading";
import {deleteWishlistItem, getWishlist} from "./api/reducers/asyncThunks";
import AuthService from "../api/authService";
import Nothing from "../Nothing";
import {Link} from "react-router-dom";

import "./Wishlist.css";
import translateService from "../translate/TranslateService";

const Wishlist = () => {
    const dispatch = useDispatch();
    const token = AuthService.getCurrentUser();
    const language = translateService.language();
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
                <div className="wishlist-container">
                    {wishlist.map((w, index) => (
                        <div className="wishlist-item" key={index}>
                            <div className="img-container">
                                <img src={`${w.stock?.item?.image}`} alt={`alt-wishlist-${index}`} height={256}/>
                            </div>
                            <div className="wishlist-item-info">
                                <div className="wishlist-item-name-price">
                                    <span>{w.stock?.item?.name}</span>
                                    <span>{w.stock?.item?.price}</span>
                                </div>
                                <span>{w.stock?.size?.value}</span>
                                <div className="wishlist-item-color">
                                    <span>{w.stock?.color?.name}</span>
                                    <span style={{ background: `${w.stock?.color?.hex}`}}></span>
                                </div>
                            </div>
                            <div className="remove-from-wishlist" onClick={() => removeItem({wishlistItemId: w.id})}>
                                <span>{translateService.itemCardDetail.removeFromWishlist[language]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )
        } else {
            return (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Nothing />
                    <div className="return-to-account">
                        <Link to="/">{translateService.wishlist.addItemsToWL[language]}</Link>
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