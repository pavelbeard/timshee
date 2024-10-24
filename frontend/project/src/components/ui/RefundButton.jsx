import { ReceiptRefundIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

export default function RefundButton({ children, to }) {
  return (
    <Link
      className={clsx(
        "flex mt-2 items-center justify-start mb-3 cursor-pointer",
        "hover:text-gray-300",
      )}
      to={to}
    >
      <ReceiptRefundIcon strokeWidth="0.5" className={clsx("size-4")} />
      <span className="roboto-text-xs">{children}</span>
    </Link>
  );
}
