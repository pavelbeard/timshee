import React, {useEffect} from "react";
import AuthService from "../../../api/authService";
import Nothing from "../../../techPages/nothing";
import {Link} from "react-router-dom";
import t from "../../../translate/TranslateService";
import { API_URL } from '../../../../config';
import Image from "../../../../components/image";
import {clsx} from "clsx";
import Color from "../../../../components/color";
import {Button} from "../../../../components/button";
import {useWishlistStore} from "../../../../store";

const space = clsx(
    'max-sm:px-6',
    'md:pl-12',
    'lg:px-12',
);

export default function Wishlist() {
    const token = AuthService.getAccessToken();
    const language = t.language();
    const { wishlist, getWishlist, deleteWishlistItem } = useWishlistStore();

    useEffect(() => {
        async function f() {
            await getWishlist();
        }
        f();
    }, []);

    return wishlist.length > 0 ?
        (
            <>
                {token?.access && <SaveWishlist language={language} />}
                <WishlistFull
                    token={token}
                    language={language}
                    wishlist={wishlist}
                    deleteWishlistItem={deleteWishlistItem}
                />
            </>
        ):
        <WishlistEmpty
            language={language}
        />

}

function SaveWishlist(props) {
    const { language } = props;
    return (
        <div className={space}>
            <span>{t.wishlist.saveWL[language]}</span>
        </div>
    )
}

function WishlistFull(props) {
    const {language, wishlist, token, deleteWishlistItem } = props;
    return (
        <div className={clsx(
            space,
            'max-sm:flex flex-col',
            'md:flex',
            'lg:grid lg:grid-cols-3 lg:gap-4',
        )}>
            {wishlist.map((w, index) => (
                <div key={index}>
                    <div className={clsx(
                        'flex items-center',
                        'max-sm:flex-col',
                    )}>
                        <Link to={`${w.stock_link}`}>
                            <Image
                                src={`${API_URL}${w.stock?.item?.image}`}
                                alt={`alt-wishlist-${index}`}
                            />
                        </Link>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <span>{w.stock?.item?.name}</span>
                            <span>{w.stock?.item?.price}
                                <span>{t.shop.price[language]}</span></span>
                        </div>
                        <span>{w.stock?.size?.value}</span>
                        <div className="flex justify-between items-center">
                            <span>{w.stock?.color?.name}</span>
                            <Color hex={w.stock?.color?.hex} />
                        </div>
                    </div>
                    <div className={clsx('pb-6')}>
                        <Button onClick={() => deleteWishlistItem(token, w.id)}>
                            {t.itemCardDetail.removeFromWishlist[language]}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

function WishlistEmpty(props) {
    const { language } = props;
    return (
        <div className="flex flex-col items-center">
            <Nothing />
            <div className="return-to-account">
                <Link to="/">{t.wishlist.addItemsToWL[language]}</Link>
            </div>
        </div>
    )
}