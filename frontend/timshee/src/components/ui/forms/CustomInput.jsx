import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import { useState } from "react";

const passwordEyeStyle = clsx(
  "w-4 h-4 absolute right-0 top-0 transform translate-y-[10%] cursor-pointer",
);

export default function CustomInput({
  className,
  labelClassName,
  htmlFor,
  labelText,
  type,
  ...rest
}) {
  const divWfull = "w-full relative";
  const commonLabelStyle = clsx("flex mb-3");
  const ifNotCheckboxOrRadio = clsx("flex-col items-start");
  const ifCheckboxOrRadio = clsx("flex justify-between");
  const commonInputStyle = clsx("sometype-mono-regular text-[0.675rem]");
  const commonSpanStyle = clsx(
    "flex justify-between",
    type !== "radio" && "pb-2",
  );
  const borderBottomStyle = "border-b border-gray-200 w-full";
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const types = {
    email: (
      <label
        htmlFor={htmlFor}
        className={clsx(labelClassName, commonLabelStyle, ifNotCheckboxOrRadio)}
      >
        <span className={clsx(commonSpanStyle)}>{labelText}</span>
        <input
          type="email"
          {...rest}
          id={htmlFor}
          className={clsx(className, commonInputStyle, borderBottomStyle)}
        />
      </label>
    ),
    tel: (
      <label
        htmlFor={htmlFor}
        className={clsx(labelClassName, commonLabelStyle, ifNotCheckboxOrRadio)}
      >
        <span className={clsx(commonSpanStyle, "")}>{labelText}</span>
        <input
          type="tel"
          {...rest}
          id={htmlFor}
          className={clsx(className, commonInputStyle, borderBottomStyle)}
        />
      </label>
    ),
    text: (
      <label
        htmlFor={htmlFor}
        className={clsx(labelClassName, commonLabelStyle, ifNotCheckboxOrRadio)}
      >
        <span className={clsx(commonSpanStyle, "")}>{labelText}</span>
        <input
          type="text"
          {...rest}
          id={htmlFor}
          className={clsx(className, commonInputStyle, borderBottomStyle)}
        />
      </label>
    ),
    password: (
      <div className={divWfull}>
        <label
          htmlFor={htmlFor}
          className={clsx(
            labelClassName,
            commonLabelStyle,
            ifNotCheckboxOrRadio,
          )}
        >
          <span className={clsx(commonSpanStyle, "")}>{labelText}</span>
          <input
            type={isPasswordRevealed ? "text" : "password"}
            {...rest}
            id={htmlFor}
            className={clsx(
              className,
              commonInputStyle,
              borderBottomStyle,
              "pr-5",
            )}
          />
          {isPasswordRevealed ? (
            <EyeSlashIcon
              className={passwordEyeStyle}
              onClick={() => setIsPasswordRevealed(false)}
            />
          ) : (
            <EyeIcon
              className={passwordEyeStyle}
              onClick={() => setIsPasswordRevealed(true)}
            />
          )}
        </label>
      </div>
    ),
    checkbox: (
      <label
        htmlFor={htmlFor}
        className={clsx(
          labelClassName,
          commonLabelStyle,
          ifCheckboxOrRadio,
          "relative",
        )}
      >
        <span className={clsx(commonSpanStyle, "")}>{labelText}</span>
        <input
          type="checkbox"
          id={htmlFor}
          {...rest}
          className={clsx(
            className,
            "flex-none",
            "appearance-none",
            "relative peer shrink-0 border w-4 h-4 mt-0.5",
            "border-gray-400 hover:bg-gray-200 hover:border-none",
          )}
        />
        <svg
          className={clsx(
            "w-4 h-4 mt-0.5",
            "absolute right-0 hidden",
            "pointer-events-none",
            "hover:text-white",
            "peer-checked:block stroke-black peer-checked:bg-gray-200",
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </label>
    ),
    radio: (
      <label
        htmlFor={htmlFor}
        className={clsx(labelClassName, commonLabelStyle, ifCheckboxOrRadio)}
      >
        <span className={clsx(commonLabelStyle, "")}>{labelText}</span>
        <input
          type="radio"
          id={htmlFor}
          {...rest}
          className={clsx(className, "flex-none appearance-none size-6")}
        />
      </label>
    ),
    textarea: (
      <label
        htmlFor={htmlFor}
        className={clsx(labelClassName, commonLabelStyle, ifNotCheckboxOrRadio)}
      >
        <span className={clsx(commonSpanStyle, "")}>{labelText}</span>
        <textarea
          id={htmlFor}
          {...rest}
          className={clsx("w-full sometype-mono-regular text-[0.675rem]")}
        />
      </label>
    ),
  };

  return types[type];
}
