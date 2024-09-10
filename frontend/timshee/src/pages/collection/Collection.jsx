import Container from "../../components/ui/Container";
import {safeArrElAccess} from "../../lib/stuff";
import CarouselCollection from "../../components/collection/CarouselCollection";
import React from "react";
import NotFound from "../NotFound";
import {useSelector} from "react-redux";
import {selectCollections} from "../../redux/features/store/storeSlice";

export default function Collection() {
    const collections = useSelector(selectCollections);
    const collection = safeArrElAccess(collections, 0);

    if (collection?.carousel_images === undefined
        || collection?.carousel_images === null
        || collection?.carousel_images?.length === 0) {
        return <NotFound />
    } else {
        return (
            <Container>
                <CarouselCollection
                    collName={collection?.name}
                    images={collection?.carousel_images}
                />
            </Container>
        );
    }
}