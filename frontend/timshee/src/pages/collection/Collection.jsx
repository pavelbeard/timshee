import Container from "../../components/ui/Container";
import CarouselSkeleton from "../../components/ui/shop/detail/CarouselSkeleton";
import {useGetCollectionImagesQuery} from "../../redux/features/api/storeApiSlice";
import {useSearchParameters} from "../../lib/hooks";
import {safeArrElAccess} from "../../lib/stuff";
import CarouselCollection from "../../components/collection/CarouselCollection";
import React from "react";
import ItemImage from "../../components/ui/ItemImage";
import {useTranslation} from "react-i18next";
import NotFound from "../NotFound";
import {Link} from "react-router-dom";

export default function Collection() {
    const { t } = useTranslation();
    const { get } = useSearchParameters();
    const { data, isLoading } = useGetCollectionImagesQuery(get('name'));
    process.env.NODE_ENV !== 'production' && console.log(data);
    const collection = safeArrElAccess(data, 0);

    if (collection?.carousel_images === undefined
        || collection?.carousel_images === null
        || collection?.carousel_images?.length === 0) {
        return <NotFound />
    }

    return (
        <Container>
            {isLoading
                ? <CarouselSkeleton/>
                : <CarouselCollection
                    collName={collection?.name}
                    images={collection?.carousel_images}
                />
            }
            <section className="grid grid-cols-2 gap-4 xl:gap-2 justify-items-center mt-16 lg:mt-24 lg:mx-24 xl:mx-48" data-collection-links="">
                <Link to={`/men/shop?collections=${collection?.link}`} className="w-32 md:w-60 xl:w-72 flex flex-col">
                    <ItemImage src={collection?.collection_image_men} alt="collection_image_men"/>
                    <span className="self-center">{t('header:men')}</span>
                </Link>
                <Link to={`/women/shop?collections=${collection?.link}`} className="w-32 md:w-60 xl:w-72 flex flex-col">
                    <ItemImage src={collection?.collection_image_women} alt="collection_image_women"/>
                    <span className="self-center">{t('header:women')}</span>
                </Link>
            </section>
        </Container>
    );
}