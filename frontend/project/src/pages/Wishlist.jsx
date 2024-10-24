// noinspection JSFileReferences

import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ItemImage from "../components/ui/ItemImage";
import { useDeleteWishlistItemMutation } from "../redux/features/api/storeApiSlice";
import { selectCurrentToken } from "../redux/features/store/authSlice";
import { selectWishlist } from "../redux/features/store/storeSlice";
import Nothing from "./Nothing";

export default function Wishlist() {
  const token = useSelector(selectCurrentToken);
  const { t } = useTranslation();
  const wishlist = useSelector(selectWishlist);
  const [deleteWLItem] = useDeleteWishlistItemMutation();

  const deleteItemFromWL = (id) => {
    deleteWLItem(id).unwrap();
  };

  if (wishlist?.length > 0) {
    return (
      <Container>
        {!token && <SaveWishlist />}
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-4">
          {wishlist.map((w, index) => (
            <div key={index}>
              <div className={clsx("flex lg:items-center flex-col")}>
                <Link className="w-full" to={`${w.stock_link}`}>
                  <ItemImage
                    src={`${w.stock?.item?.image}`}
                    alt={`alt-wishlist-${index}`}
                    className="lg:h-[650px]"
                  />
                </Link>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="roboto-text">{w.stock?.item?.name}</span>
                  <span className="roboto-text">
                    {w.stock?.item?.price}
                    <span className="roboto-text">{t("shop:price")}</span>
                  </span>
                </div>
                <span className="roboto-text">{w.stock?.size?.value}</span>
                <span className="roboto-text">{w.stock?.color?.name}</span>
              </div>
              <div className={clsx("pb-6")}>
                <button
                  className="underlined-button"
                  onClick={() => deleteItemFromWL(w.id)}
                >
                  {t("shop.itemCardDetail:removeFromWishlist")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    );
  } else {
    return <WishlistEmpty />;
  }
}

function SaveWishlist() {
  const { t } = useTranslation();
  return (
    <div>
      <span className="roboto-medium">{t("wishlist:saveWL")}</span>
    </div>
  );
}

function WishlistEmpty() {
  const { t } = useTranslation();
  return (
    <Container className="flex flex-col items-center">
      <Nothing />
      <div className="w-1/3">
        <Button>
          <Link className="w-full h-full" to="/women/shop">
            {t("wishlist:addItemsToWL")}
          </Link>
        </Button>
      </div>
    </Container>
  );
}
