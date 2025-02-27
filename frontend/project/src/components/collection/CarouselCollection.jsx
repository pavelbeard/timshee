import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useThrottle } from "../../lib/hooks";

export default function CarouselCollection({ collName, images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageCurrentNumber, setImageCurrentNumber] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const hasLoaded = () => setLoaded(true);

  const nextImage = useThrottle(() => {
    const newIndex =
      currentImageIndex >= images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  }, 500);

  const prevImage = useThrottle(() => {
    const newIndex =
      currentImageIndex <= 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  }, 500);

  const style = clsx(
    "group",
    "size-8 lg:size-10",
    "hover:text-gray-200",
    "outline-none",
  );

  useEffect(() => {
    setImageCurrentNumber(currentImageIndex + 1);
  }, [currentImageIndex]);

  return (
    <div className="min-w-[200px] relative min-h-[400px] md:min-w-[400px] xl:min-w-[600px] flex flex-col items-center justify-center">
      <section
        className={clsx(
          "z-0",
          !loaded && "bg-gray-400 blur transition opacity ease-in-out",
        )}
        data-image=""
      >
        <img
          onLoad={hasLoaded}
          src={`${images[currentImageIndex]?.image}`}
          alt={`alt-img-${images[currentImageIndex]?.id || 1}`}
          className="lg:h-[650px]"
          loading="lazy"
        />
      </section>
      <section
        className="absolute -bottom-12 w-full md:max-w-[400px] flex items-center justify-between"
        data-btns=""
      >
        <button className={clsx(style)} onClick={prevImage}>
          <ArrowLeftIcon strokeWidth="0.5" className="group-hover:stroke-1" />
        </button>
        <span className="roboto-light">
          {collName} / {imageCurrentNumber}
        </span>
        <button className={clsx(style)} onClick={nextImage}>
          <ArrowRightIcon strokeWidth="0.5" className="group-hover:stroke-1" />
        </button>
      </section>
    </div>
  );
}
