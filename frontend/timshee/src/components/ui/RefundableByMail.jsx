import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export default function RefundableByMail({ children, className }) {
  return (
    <div className={clsx("has-tooltip", className)}>
      <ExclamationTriangleIcon
        strokeWidth="0.5"
        className="size-6 mt-1 mr-1 hover:stroke-gray-500"
      />
      <div
        className={clsx(
          "bg-gray-300 rounded-lg p-4",
          "tooltip text-xs w-1/4 roboto-medium -mt-10",
        )}
      >
        {children}
      </div>
    </div>
  );
}
