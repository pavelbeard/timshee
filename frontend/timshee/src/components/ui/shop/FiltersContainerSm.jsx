import FiltersHeaderSm from "./FiltersHeaderSm";
import FiltersGroupSm from "./FiltersGroupSm";
import FiltersFooterSm from "./FiltersFooterSm";
import React from "react";

export default function FiltersContainerSm({ onClose }) {
    const robotoText = 'roboto-text-sm tracking-widest';
    return(
        <div
            className="absolute bg-white top-0 left-0 md:w-1/2 w-full h-screen flex flex-col justify-between p-6"
            onClick={e => e.stopPropagation()}
        >
                <FiltersHeaderSm robotoText={robotoText} />
                <FiltersGroupSm robotoText={robotoText}/>
                <FiltersFooterSm onClose={onClose} />
        </div>
    )
}