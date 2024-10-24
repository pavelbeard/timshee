import { Link } from "react-router-dom";
import ItemImage from "../ui/ItemImage";

const MainCollection = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 lg:p-2">
      <Link
        to={data ? `/collection?name=${data?.link}` : "/"}
        className="flex flex-col items-center"
      >
        <ItemImage
          src={data?.collection_image}
          className="w-full lg:w-1/2"
          alt="collection-img"
        />
        <p className="pt-2">{data?.name}</p>
      </Link>
    </div>
  );
};

export default MainCollection;
