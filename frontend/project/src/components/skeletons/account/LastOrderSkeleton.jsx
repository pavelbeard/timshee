import { clsx } from "clsx";

export default function LastOrderSkeleton() {
  const divider = clsx("bg-gray-300 mb-2 h-[0.0825rem]");
  const blocksContainer = clsx(
    "flex flex-col justify-items-start h-full w-full",
    "max-sm:pb-2",
    "sm:pb-2",
  );
  return (
    <div className={blocksContainer} data-last-order="">
      <div className="h-60 mb-4 bg-gray-200">
        <div className="h-6 bg-gray-300"></div>
        <div className={divider}></div>
        <section className="h-48 bg-gray-300"></section>
      </div>
      <section className="h-12 w-1/2 bg-gray-300"></section>
    </div>
  );
}
