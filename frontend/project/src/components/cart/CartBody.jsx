import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsCartMenuOpen } from "../../redux/features/store/uiControlsSlice";

export default function CartBody({ children, ...rest }) {
  const isCartMenuOpen = useSelector(selectIsCartMenuOpen);
  return (
    <div
      {...rest}
      className={clsx(
        "bg-white",
        isCartMenuOpen
          ? "lg:w-6/12 xl:w-5/12 w-full z-150 h-screen overflow-y-auto absolute right-0"
          : "w-full min-h-screen",
      )}
    >
      {children}
    </div>
  );
}
