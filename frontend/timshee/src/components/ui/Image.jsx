import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Image({
  src,
  alt,
  imgClassName,
  containerClassName,
  containerHeight = "h-full",
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef(null);
  const hasLoaded = () => setLoaded(true);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.addEventListener("load", hasLoaded);
      return () => imageRef?.current?.removeEventListener("load", hasLoaded);
    }
  }, [imageRef]);

  return (
    <div
      className={clsx(
        containerClassName,
        containerHeight,
        "flex justify-center items-center",
        !loaded && "bg-gray-400 blur transition opacity ease-in-out",
      )}
      data-blur-container=""
    >
      <img
        ref={imageRef}
        src={src}
        alt={src}
        className={clsx(imgClassName, !loaded && "opacity-0")}
        loading="lazy"
        {...rest}
      />
    </div>
  );
}
