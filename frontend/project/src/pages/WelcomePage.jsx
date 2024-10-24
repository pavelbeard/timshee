import { useSelector } from "react-redux";
import Cards from "../components/welcomePage/Cards";
import MainCollection from "../components/welcomePage/MainCollection";
import { ArrayAtPolyfil } from "../lib/stuff";
import Error from "./Error";
import Loading from "./Loading";

const WelcomePage = () => {
  const { collections, categories, isLoading } = useSelector((s) => s.store);
  const data = ArrayAtPolyfil(
    collections?.filter((c) => c.show_in_welcome_page),
    0,
  );

  if (isLoading) {
    return <Loading />;
  } else if (collections || categories) {
    return (
      <div className="pt-0.5 min-h-screen">
        <MainCollection data={data} />
        <Cards data={categories} />
      </div>
    );
  } else {
    return <Error />;
  }
};

export default WelcomePage;
