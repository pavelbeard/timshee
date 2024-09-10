import {useTranslation} from "react-i18next";
import {XMarkIcon} from "@heroicons/react/24/outline";
import React from "react";
import {Link, useLocation} from "react-router-dom";

export default function CartHeader({ onClose }) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    return (
        <div className="flex items-center justify-between py-2 px-6 border-b-[1px]">
            <h1 className="text-2xl tracking-wider">{t('cart:yourCart')}</h1>
            <button>
                {pathname !== '/cart'
                    ? <XMarkIcon
                        strokeWidth="0.5"
                        className="size-6"
                        onClick={onClose}
                    />
                    : <Link className="flex items-center" to={'/'}>
                        <XMarkIcon
                            strokeWidth="0.5"
                            className="size-6"
                        />
                    </Link>
                }
            </button>
        </div>
    )
}