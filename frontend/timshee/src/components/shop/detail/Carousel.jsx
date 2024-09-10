import React, {useState} from "react";
import {clsx} from "clsx";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import Image from "../../ui/Image";
import {API_URL} from "../../../config";
import ItemImage from "../../ui/ItemImage";

const Carousel = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        const newIndex = currentImageIndex >= images.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };

    const prevImage = () => {
        const newIndex = currentImageIndex <= 0 ? images.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex)
    };

    const style = clsx(
        'group',
        'absolute z-10 top-1/2',
        'size-8',
        'lg:size-10',
        'hover:text-gray-200',
        'outline-none'
    );

    return(
        <div className="flex justify-center items-start">
            <div className="relative z-0 flex items-center">
                <button className={clsx(style, 'left-2')} onClick={prevImage}>
                    <ArrowLeftIcon strokeWidth="0.5" className="group-hover:stroke-1"/>
                </button>
                <ItemImage
                    src={`${API_URL}${images[currentImageIndex]?.image}`}
                    alt={`alt-img-${images[currentImageIndex]?.id || 1}`}
                    className='lg:h-[650px]'
                />
                <button className={clsx(style, 'right-2')} onClick={nextImage} >
                    <ArrowRightIcon strokeWidth="0.5" className="group-hover:stroke-1"/>
                </button>
            </div>
        </div>
    )
};

export default Carousel;