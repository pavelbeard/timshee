import { clsx } from "clsx";
import { Link } from "react-router-dom";
import ItemImage from "../ItemImage";

export default function MenuTypes({ id, url, types, categoryImg }) {
  const typesStyle = clsx("p-1 roboto-text-sm");
  const typesData = types?.map((type, index) =>
    type?.total === 0 ? (
      <span
        key={index}
        className={clsx(
          typesStyle,
          "bg-gray-200 text-gray-500 cursor-not-allowed",
        )}
      >
        {type.name}
      </span>
    ) : (
      <Link
        key={index}
        to={`${url}&types=${type.code}`}
        aria-disabled={type?.total === 0}
        className={clsx(typesStyle, "hover:bg-gray-200 hover:text-gray-600")}
      >
        {type.name}
      </Link>
    ),
  );
  return (
    <div
      id={id}
      aria-labelledby={id}
      role="menu"
      className={clsx(
        "absolute z-[60] left-0 w-full top-[8rem] transition-all duration-300 ease-in-out",
        "overflow-hidden",
        types?.length > 0 ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className="bg-gray-100 h-96 xl:mx-52 mx-32 py-6 grid grid-cols-2">
        <div className="flex flex-col mx-6">{typesData}</div>
        <div className="px-3 border-l-gray-400 border-l-2">
          <ItemImage
            src={categoryImg}
            alt={`category-img-${id}`}
            className={"w-60 h-[22rem]"}
          />
        </div>
      </div>
    </div>
  );
}
