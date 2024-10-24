import { clsx } from "clsx";

export default function Button({ children, width, className, ...rest }) {
  const btn = clsx(
    "border-[1px] border-black flex items-center justify-center ",
    "tracking-widest py-3 mt-2",
    rest?.disabled
      ? "bg-gray-200 pointer-events-none"
      : "hover:bg-black hover:text-white cursor-pointer",
  );
  return (
    <button
      {...rest}
      className={clsx(btn, className, width ? width : "w-full")}
    >
      {children}
    </button>
  );
}
