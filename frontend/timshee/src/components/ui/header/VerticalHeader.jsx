import { XMarkIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useState } from "react";
import MenuLeftRecursive from "./MenuLeftRecursive";
import MenuRightRecursive from "./MenuRightRecursive";

export default function VerticalHeader({ onClose }) {
  const verticalMenuStyle = clsx("flex flex-col items-center z-150");
  const verticalHeader = clsx(
    "pb-6 flex flex-col bg-white h-screen overflow-y-auto md:w-1/2",
  );
  const [openMenus, setOpenMenus] = useState({});
  const handleClickMenu = (menuTitle, level) => {
    setOpenMenus((prev) => ({
      ...prev,
      [level]: prev[level] === menuTitle ? null : menuTitle,
    }));
  };
  return (
    <header
      className={verticalHeader}
      onClick={(e) => e.stopPropagation()}
      data-vertical-header=""
    >
      <div className="relative">
        <div className="flex w-full z-150 items-start p-6">
          <XMarkIcon
            strokeWidth="0.5"
            className="size-8 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <MenuLeftRecursive
          level={0}
          openMenus={openMenus}
          setOpenMenus={handleClickMenu}
          className={clsx(verticalMenuStyle)}
        />
        <MenuRightRecursive
          level={0}
          openMenus={openMenus}
          setOpenMenus={handleClickMenu}
          className={clsx(verticalMenuStyle)}
        />
      </div>
    </header>
  );
}
