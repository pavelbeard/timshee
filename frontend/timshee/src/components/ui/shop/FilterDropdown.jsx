import {useTranslation} from "react-i18next";

export default function FilterDropdown({ children, selected, reset }) {
    const { t } = useTranslation();
    return(
        <div
            data-filter-dropdown="true"
            className="flex flex-col min-h-48 w-64 bg-white border-gray-200 border-[1px]">
            <div className="m-4 flex justify-between border-gray-200 border-b-[1px]">
                <span className="roboto-text">{t('shop:selected')} ({selected})</span>
                <button
                    onClick={reset}
                    className="roboto-text hover:underline hover:underline-offset-2">
                    {t('shop:reset')}
                </button>
            </div>
            <div className="mx-4 mb-2 flex flex-col">{children}</div>
        </div>
    )
}