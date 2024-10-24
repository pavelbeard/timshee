import { clsx } from "clsx";
import { useSelector } from "react-redux";
import EmailBlock from "../../components/account/EmailBlock";
import LastOrder from "../../components/account/LastOrder";
import PrimaryAddress from "../../components/account/PrimaryAddress";
import EmailSkeleton from "../../components/account/skeletons/EmailSkeleton";
import LastOrderSkeleton from "../../components/skeletons/account/LastOrderSkeleton";
import PrimaryAddressSkeleton from "../../components/skeletons/account/PrimaryAddressSkeleton";
import Container from "../../components/ui/Container";
import { ArrayAtPolyfil } from "../../lib/stuff";
import {
  useGetAddressesByUserQuery,
  useGetOrdersByUserQuery,
} from "../../redux/features/api/accountApiSlice";
import { selectCurrentUser } from "../../redux/features/store/authSlice";

const AccountDetails = () => {
  window.document.title = "Account | Timshee store";
  const user = useSelector(selectCurrentUser);
  const { currentData: addresses, isLoading: isAddressesLoading } =
    useGetAddressesByUserQuery();
  const { currentData: orders, isLoading: isOrdersLoading } =
    useGetOrdersByUserQuery();

  const secondBlock = clsx(
    "items-center justify-items-center pb-[50px]",
    "max-sm:flex max-sm:flex-col",
    "lg:grid lg:grid-cols-2 lg:gap-x-1",
  );
  const lastOrder = ArrayAtPolyfil(orders, -1);

  return (
    <Container>
      {user ? <EmailBlock user={user} /> : <EmailSkeleton />}
      <div className={secondBlock} data-second-block="">
        {isAddressesLoading ? (
          <PrimaryAddressSkeleton />
        ) : (
          <PrimaryAddress
            primaryAddress={addresses?.find((a) => a.as_primary)}
          />
        )}
        {isOrdersLoading ? (
          <LastOrderSkeleton />
        ) : (
          <LastOrder lastOrder={lastOrder} deliveredAt={"lastOrder"} />
        )}
      </div>
    </Container>
  );
};

export default AccountDetails;
