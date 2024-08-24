import React from "react";

export default function EmailSkeleton() {

    return (
        <div className="flex pb-4" data-first-block-skeleton="">
            <span className="flex items-center justify-start w-16 h-8 text-center mr-2 bg-gray-200"></span>
            <span className="flex items-center justify-center w-48 h-8 text-center bg-gray-200"></span>
            <span className="flex items-center justify-end w-28 h-8 text-center ml-2 bg-gray-200"></span>
        </div>
    )
}