import { CheckIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export default function Checkbox({
  htmlFor,
  labelText,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex relative my-1">
      <input
        className={clsx(
          "appearance-none border border-gray-300 size-4 peer",
          disabled && "bg-gray-100",
        )}
        id={htmlFor}
        type="checkbox"
        disabled={disabled}
        onChange={onChange}
        checked={checked || false}
      />
      <CheckIcon
        strokeWidth="0.5"
        className={clsx(
          "hidden size-4 absolute peer-checked:block peer-checked:stroke-black peer-checked:bg-gray-200",
          "pointer-events-none",
        )}
      />
      <label
        className={clsx(
          "roboto-light text-xs ml-1",
          disabled && "text-gray-500",
        )}
        htmlFor={htmlFor}
      >
        {labelText}
      </label>
    </div>
  );
}
