import { clsx } from "clsx";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function MenuFlatLeaf({ item }) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-expanded="true"
        aria-haspopup="true"
        aria-controls={id}
        className="text-lg"
      >
        {item?.title}
      </button>
      <div
        id={id}
        aria-labelledby={id}
        role="menu"
        className={clsx(
          isOpen ? "pt-1 absolute w-28 -translate-x-4" : "hidden",
        )}
      >
        <ul className={clsx("bg-gray-200 p-3")}>
          {item?.subMenu?.map((subMenuItem, index) => (
            <li
              key={index}
              className={clsx("p-1 hover:bg-gray-300 hover:text-gray-600")}
            >
              <Link className="roboto-light text-sm" to={subMenuItem?.url}>
                {subMenuItem?.title}
                {subMenuItem?.quantity && (
                  <span className="ml-1 roboto-light text-sm">
                    {subMenuItem?.quantity}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
