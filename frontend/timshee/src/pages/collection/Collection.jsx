import { useSelector } from "react-redux";
import CarouselCollection from "../../components/collection/CarouselCollection";
import Container from "../../components/ui/Container";
import { ArrayAtPolyfil } from "../../lib/stuff";
import { selectCollections } from "../../redux/features/store/storeSlice";
import NotFound from "../NotFound";

export default function Collection() {
  const collections = useSelector(selectCollections);
  const collection = ArrayAtPolyfil(collections, 0);

  if (
    collection?.carousel_images === undefined ||
    collection?.carousel_images === null ||
    collection?.carousel_images?.length === 0
  ) {
    return <NotFound />;
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
