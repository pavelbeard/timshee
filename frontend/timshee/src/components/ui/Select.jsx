import {clsx} from "clsx";
import {useTranslation} from "react-i18next";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {useRef, useState} from "react";
import {useClickOutside} from "../../lib/hooks";

export default function Select({
   htmlFor,
   labelText,
   value,
   accessValue,
   valueLabel,
   values,
   onChange,
   disabled=false
}) {
    const selectRef = useRef(null);
    const [showList, toggleShowList] = useClickOutside(selectRef);
    const _onChange = (e) => {
        toggleShowList();
        onChange(e);
    };

    return(
        <div className="lg:w-1/2">
            <label
                className={clsx("roboto-text", disabled && 'text-gray-500')}
                htmlFor={htmlFor}
            >
                {labelText}
            </label>
            <div className="relative mt-2" ref={selectRef}>
                <button
                    type="button"
                    className={clsx(
                        'relative w-full cursor-default bg-white border-[1px] border-gray-300 py-1',
                        'pl-3 pr-10 text-left',
                        'lg:py-0.5'
                    )}
                    onClick={toggleShowList}
                    aria-haspopup="listbox"
                    aria-expanded="true"
                    aria-labelledby={htmlFor}
                >
                    <span className="flex items-center">
                        <span className="ml-3 h-4 roboto-text-medium-xs">{value}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon strokeWidth="0.5" className="size-4"  />
                    </span>
                </button>
                <ul
                    className={clsx(
                        showList
                            ? ['absolute z-10 mt-1 max-h-56 w-full overflow-y-auto',
                            'bg-white py-1 border-[1px] border-gray-300 focus:outline-none']
                            : ['hidden']
                    )}
                    tabIndex="-1"
                    role="listbox"
                    aria-labelledby={htmlFor}
                    aria-activedescendant={`${htmlFor}-option-0`}
                >
                    {values?.map((listItem, idx) => (
                        <li
                            key={idx}
                            className={clsx(
                                'relative cursor-default select-none roboto-text-xs py-1 pl-3 pr-9',
                                'hover:bg-gray-200 hover:text-gray-600'
                            )}
                            role="option"
                            onClick={_onChange}
                            value={listItem[accessValue]}
                            id={`${htmlFor}-option-${idx}`}
                        >
                            <div className="flex items-center pointer-events-none">
                                <span className="roboto-text-xs ml-3 block truncate">
                                    {listItem[valueLabel]}
                                </span>
                            </div>
                            {listItem?.selected && <span
                                className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <CheckIcon strokeWidth="0.5" className="size-4"/>
                            </span>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}