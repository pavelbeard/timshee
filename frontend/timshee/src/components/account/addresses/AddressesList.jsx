import { clsx } from "clsx";
import { useSelector } from "react-redux";
import Error from "../../../pages/Error";
import Loading from "../../../pages/Loading";
import Nothing from "../../../pages/Nothing";
import { useGetAddressesByUserQuery } from "../../../redux/features/api/accountApiSlice";
import { selectCurrentAddresses } from "../../../redux/features/store/accountSlice";
import AddressCard from "./AddressCard";

export default function AddressesList(props) {
  const addressesList = useSelector(selectCurrentAddresses);
  const { isLoading, currentData } = useGetAddressesByUserQuery();
  const addresses = addressesList || currentData;

  if (isLoading) {
    return <Loading />;
  } else if (!isLoading) {
    return (
      <div
        className={clsx(
          "max-sm:flex max-sm:flex-col gap-4",
          "lg:grid lg:grid-cols-3",
          "lg:grid lg:grid-cols-3",
        )}
      >
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <AddressCard address={address} key={index} />
          ))
        ) : (
          <Nothing />
        )}
      </div>
    );
  } else {
    return <Error />;
  }
}
