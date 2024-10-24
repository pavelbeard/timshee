import { clsx } from "clsx";

export default function UnderlineDynamic({ underline }) {
  return (
    <span
      className={clsx(
        underline
          ? "block w-full h-[0.5px] bg-gray-400"
          : "block max-w-0 group-hover:max-w-full transition-all duration-300 h-[0.5px] bg-black",
      )}
    ></span>
  );
}
