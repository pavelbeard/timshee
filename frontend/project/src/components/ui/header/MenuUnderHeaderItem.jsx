import { clsx } from "clsx";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import MenuTypes from "./MenuTypes";

export default function MenuUnderHeaderItem({
  apply_gender = null,
  item = null,
  withoutList = false,
}) {
  const id = useId();
  const { gender } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, _] = useSearchParams();
  const disabled = item?.total === 0;
  const collections = search.get("collections");
  const url = `${gender}/shop?${collections ? `collections=${collections}&` : ""}categories=${item?.code}`;
  if (withoutList) {
    return (
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
      >
        <button
          className={clsx(
            "p-2",
            isOpen && "bg-gray-100",
            pathname.startsWith(`/${gender}/shop`) && "bg-gray-200",
          )}
        >
          <Link to={`${gender}/shop`}>{t(`header:${gender}All`)}</Link>
        </button>
      </div>
    );
  } else {
    return (
      <div
        onMouseEnter={() => !disabled && setIsOpen(true)}
        onMouseLeave={() => !disabled && setIsOpen(false)}
        onClick={() => !disabled && setIsOpen(false)}
      >
        <button
          disabled={disabled}
          className={clsx(
            "p-2",
            isOpen && "bg-gray-100",
            disabled && "bg-gray-200 text-gray-500",
          )}
          aria-expanded="true"
          aria-haspopup="true"
          aria-controls={id}
        >
          {disabled ? (
            <span>{item?.name}</span>
          ) : (
            <Link to={url}>{item?.name}</Link>
          )}
        </button>
        {isOpen && (
          <MenuTypes
            id={id}
            url={url}
            types={item?.types}
            categoryImg={item[`category_image_${gender}`]}
          />
        )}
      </div>
    );
  }
}
