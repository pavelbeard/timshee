import { clsx } from "clsx";

export default function ShopHeaderSkeleton() {
  const collNameStyle = clsx(
    "flex flex-col items-center bg-gray-200",
    "max-sm:text-xl max-sm:p-2 max-sm:w-84 max-sm:h-10",
    "md:text-2xl md:p-4",
    "lg:text-3xl lg:p-6",
  );
  return <div className={collNameStyle}></div>;
}
