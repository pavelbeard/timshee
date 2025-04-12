import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Carousel from "../../../components/shop/detail/Carousel";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import CarouselSkeleton from "../../../components/ui/shop/detail/CarouselSkeleton";
import Colors from "../../../components/ui/shop/detail/Colors";
import ColorsSkeleton from "../../../components/ui/shop/detail/ColorsSkeleton";
import Sizes from "../../../components/ui/shop/detail/Sizes";
import SizesSkeleton from "../../../components/ui/shop/detail/SizesSkeleton";
import { useSearchParameters } from "../../../lib/hooks";
import { ArrayAtPolyfil } from "../../../lib/stuff";
import { useAddCartItemMutation } from "../../../redux/features/api/cartApiSlice";
import {
  useAddWishlistItemMutation,
  useDeleteWishlistItemMutation,
  useGetItemQuery,
  useGetWishlistItemQuery,
} from "../../../redux/features/api/storeApiSlice";
import { selectStocks } from "../../../redux/features/store/storeSlice";

const ItemDetail = () => {
  const { pathname } = useLocation();
  const { itemId } = useParams();
  const { t } = useTranslation();
  const { search, get } = useSearchParameters();
  const { data: item, isLoading, isSuccess } = useGetItemQuery(itemId);
  const filtersWL = new URLSearchParams({
    stock__item_id: itemId,
    stock__size__value: get("size"),
    stock__color__name: get("color"),
  }).toString();
  const { data: isThereItemInWL } = useGetWishlistItemQuery(filtersWL);
  const [addItemToWL] = useAddWishlistItemMutation();
  const [deleteItemFromWL] = useDeleteWishlistItemMutation();
  const [addItemToCart] = useAddCartItemMutation();
  const [inCart, setInCart] = useState(false);
  const [isAddInfoOpen, setIsAddInfoOpen] = useState(false);
  const toggleAddInfo = () => setIsAddInfoOpen(!isAddInfoOpen);
  const stocks = useSelector(selectStocks);
  const inStock =
    stocks.find((s) => s.size === get("size") && s.color === get("color"))
      ?.inStock > 0;

  const cartButtonText = inStock
    ? inCart
      ? t("shop.itemCardDetail:hasAdded")
      : t("shop.itemCardDetail:addToCart")
    : t("shop.itemCardDetail:outOfStock");
  const wlButtonText =
    isThereItemInWL?.length > 0
      ? t("shop.itemCardDetail:removeFromWishlist")
      : t("shop.itemCardDetail:addToWishlist");

  const addToCart = () => {
    addItemToCart({
      item_id: itemId,
      size_id: stocks.find((s) => s.size === get("size"))?.sizeId,
      color_id: stocks.find((s) => s.color === get("color"))?.colorId,
      quantity: 1,
    })
      .unwrap()
      .then(() => setInCart(true))
      .catch((err) => console.error(err));
  };

  const toggleWishlistButton = () => {
    if (isThereItemInWL?.length > 0) {
      deleteItemFromWL(ArrayAtPolyfil(isThereItemInWL, 0)?.id).unwrap();
    } else {
      addItemToWL({
        stock__item_id: itemId,
        stock__size__value: get("size"),
        stock__color__name: get("color"),
        stock__link: `${pathname}?${search.toString()}`,
      })
        .unwrap()
        .catch((err) => null);
    }
  };

  return (
    <Container>
      <div className="my-4 flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
        <section className="lg:flex lg:justify-end" data-item-images="">
          {isLoading ? (
            <CarouselSkeleton />
          ) : (
            isSuccess && <Carousel images={item?.carousel_images} />
          )}
        </section>
        <section className="mt-2 lg:mt-0 lg:px-12" data-item-info="">
          <div className="flex justify-between mb-2" data-price="">
            <span className="roboto-medium">{item?.name}</span>
            <span className="roboto-medium">
              {"N/A"}
              {/* {item?.price} */}
              {t("shop:price")}
            </span>
          </div>
          <div className="bg-gray-100 p-6" data-description="">
            <pre className="tracking-wide roboto-text text-wrap max-w-fit">
              {item?.description}
            </pre>
          </div>
          {item?.add_info && (
            <div
              className={clsx(
                isAddInfoOpen ? "bg-gray-200" : "bg-gray-100",
                "mt-2 p-6 cursor-pointer",
              )}
              data-add-info=""
              onClick={toggleAddInfo}
            >
              <pre
                className={clsx(
                  "tracking-wide roboto-text max-w-fit",
                  isAddInfoOpen ? "text-wrap" : "truncate",
                )}
              >
                {item?.add_info}
              </pre>
            </div>
          )}
          <div data-stock-selection="">
            {isLoading ? <SizesSkeleton /> : isSuccess && <Sizes />}
            {isLoading ? <ColorsSkeleton /> : isSuccess && <Colors />}
          </div>
          <div data-stock-into-cart="">
            <Button
              disabled={!inStock || inCart}
              onClick={addToCart}
              className="group"
            >
              {cartButtonText}
              {inStock && (
                <ShoppingCartIcon
                  strokeWidth="0.5"
                  className="ml-2 size-4 group-hover:stroke-1"
                />
              )}
            </Button>
          </div>
          <div className="mt-2" data-stock-add-to-wish="">
            <button
              className="underlined-button"
              onClick={toggleWishlistButton}
            >
              {wlButtonText}
            </button>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default ItemDetail;
