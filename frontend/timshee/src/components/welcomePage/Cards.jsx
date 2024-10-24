import { clsx } from "clsx";
import { Link, useParams } from "react-router-dom";
import Error from "../../pages/Error";
import Loading from "../../pages/Loading";
import NotFound from "../../pages/NotFound";
import ItemImage from "../ui/ItemImage";

export default function Cards({ data = [] }) {
  const { gender } = useParams();
  const cards = () => {
    switch (data?.length) {
      case undefined || null:
        return <Error />;
      case 0:
        return <NotFound />;
      case 1:
        const code = data[0]?.code;
        const src = data[0]?.[`category_image_${gender}`];
        const name = data[0]?.name;
        return (
          <Link
            to={`/${gender}/shop?categories=${code}`}
            className="flex flex-col items-center"
          >
            <ItemImage
              src={src}
              className="lg:h-[400px] xl:h-[600px] lg:w-full"
              alt="alt-1"
            />
            <p className="pt-2">{name}</p>
          </Link>
        );
      default:
        return (
          <div className="lg:flex grid grid-cols-2 gap-2">
            {Array.isArray(data) ? (
              data?.map((category, index) => (
                <div className="flex-shrink-0 p-1" key={index}>
                  <Link
                    to={`/${gender}/shop?categories=${category.code}`}
                    className="flex flex-col items-center"
                  >
                    <ItemImage
                      src={category[`category_image_${gender}`]}
                      className="lg:h-[400px] lg:w-full"
                      alt={`alt-${index}`}
                    />
                    <p className="pt-2">{category.name}</p>
                  </Link>
                </div>
              ))
            ) : (
              <Loading />
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center p-6",
        data?.length > 3 && "md:overflow-x-auto lg:overflow-x-auto",
      )}
    >
      {cards()}
    </div>
  );
}
