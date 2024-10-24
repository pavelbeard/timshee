import { clsx } from "clsx";

// WIP

export default function ItemCardSkeleton() {
  const itemContainerSkeleton = clsx(
    "min-h-60 bg-gray-200 flex flex-col items-center",
    "md:h-80",
    "lg:h-96",
  );
  const imgSkeleton = clsx(
    "min-h-52 w-full bg-gray-300",
    "md:h-72",
    "lg:h-[22rem]",
  );
  const itemPropsSkeleton = clsx(
    "h-6 w-full mt-1 bg-gray-300 flex justify-between",
  );
  const propSkeleton = clsx("h-4 w-2/3 bg-gray-400");
  return (
    <div className={itemContainerSkeleton}>
      <div className={imgSkeleton}></div>
      <div className={itemPropsSkeleton}>
        <div className={clsx(propSkeleton, "mr-1")}></div>
        <div className={clsx(propSkeleton, "ml-1")}></div>
      </div>
    </div>
  );
}
