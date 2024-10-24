import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../lib/hooks";
import { useDeleteAddressMutation } from "../../../redux/features/api/accountApiSlice";
import { setAddress } from "../../../redux/features/store/accountSlice";
import { toggleAddressForm } from "../../../redux/features/store/uiControlsSlice";

export default function AddressCard(props) {
  const dispatch = useAppDispatch();
  const { address } = props;
  const { t } = useTranslation();
  const [deleteAddress, { error: deleteAddressError }] =
    useDeleteAddressMutation();

  const divider = clsx("bg-gray-300 mb-2 h-[0.0825rem]");
  const changeAddress = clsx(
    "flex",
    "max-sm:2/3",
    "md:w-3/5",
    "lg:w-10/12",
    "xl:w-2/3",
  );
  const callEditAddressForm = (address) => {
    dispatch(setAddress(address));
    dispatch(toggleAddressForm(true));
  };
  return (
    <div className="flex flex-col w-full max-sm:mb-6 md:mb-6 bg-gray-100 p-6">
      {address.as_primary ? (
        <PrimaryBlock />
      ) : (
        <CommonBlock index={address.id} />
      )}
      <div className={clsx(divider)}></div>
      <span className="roboto-light">
        {address?.first_name} {address?.last_name}
      </span>
      <span className="roboto-light">{address?.address1}</span>
      <span className="roboto-light">{address?.address2}</span>
      <span className="roboto-light">{address?.postal_code}</span>
      <span className="roboto-light">{address?.city}</span>
      <span className="roboto-light">{address?.province?.name}</span>
      <span className="roboto-light">{address?.province?.country?.name}</span>
      <span className="roboto-light">
        {"+" + address?.phone_code?.phone_code + " " + address?.phone_number}
      </span>
      <span className="roboto-light">{address?.email}</span>
      <div className={changeAddress}>
        <button
          className="underlined-button"
          onClick={() => callEditAddressForm(address)}
        >
          {t("account:edit")}
        </button>
        <button
          className="underlined-button pl-3"
          onClick={async () => await deleteAddress(address.id)}
        >
          {t("account:delete")}
        </button>
      </div>
      {deleteAddressError?.message && (
        <div className="text-red-500 roboto-medium">
          {deleteAddressError.message}
        </div>
      )}
    </div>
  );
}

const infoBlock = clsx("tracking-widest roboto-medium");

function PrimaryBlock(props) {
  const { t } = useTranslation();
  return <div className={infoBlock}>{t("account:primaryAddress")}</div>;
}

function CommonBlock(props) {
  const { index } = props;
  const { t } = useTranslation();
  return (
    <div className={infoBlock}>
      {t("account:address")} {index + 1}
    </div>
  );
}
