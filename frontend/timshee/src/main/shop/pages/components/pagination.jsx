import {clsx} from "clsx";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid";
import React from "react";

export default function Pagination ({ totalPages, currentPage, setCurrentPage, prevPage, nextPage }) {
    const pages = [];
    const page = (i) => {
        return (
            <div key={i} aria-disabled={i === currentPage}
                 className={clsx(
                     'mx-6',
                     i === currentPage ? "underline underline-offset-2" : "cursor-pointer"
                 )}
                 onClick={() => setCurrentPage(i)}
            >
                {i}
            </div>
        );
    };

    pages.push(
        <div className="pagination-arrows" key={0} onClick={prevPage}>
            <ArrowLeftIcon className="w-4 h-4"/>
        </div>
    );

    for (let i = 1; i <= totalPages; i++) {

        if (totalPages > 5) {
            if (i === 1 || i === totalPages) {
                pages.push(page(i));
            } else if (i === currentPage) {
                pages.push(page(i));
            } else if (i === currentPage + 1 || i === currentPage - 1) {
                pages.push(page(i));
            } else if (i === currentPage + 2 || i === currentPage - 2) {
                pages.push(
                    <div className="span" key={i}><span>...</span></div>
                );
            }
        } else {
            pages.push(page(i));
        }
    }

    pages.push(
        <div className="pagination-arrows" key={totalPages + 1} onClick={nextPage}>
            <ArrowRightIcon className="w-4 h-4"/>
        </div>
    )

    return <div className="flex justify-center items-center">{pages}</div>;
};
