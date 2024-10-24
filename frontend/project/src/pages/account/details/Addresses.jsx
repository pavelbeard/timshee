import { useTranslation } from "react-i18next";
import AddressesList from "../../../components/account/addresses/AddressesList";
import AddButton from "../../../components/ui/AddButton";
import BackButton from "../../../components/ui/BackButton";
import Container from "../../../components/ui/Container";
import { useAppDispatch } from "../../../lib/hooks";
import { setAddress } from "../../../redux/features/store/accountSlice";
import { toggleAddressForm } from "../../../redux/features/store/uiControlsSlice";

export default function Addresses() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const addAddress = () => {
    dispatch(toggleAddressForm());
    dispatch(setAddress(null));
  };

  return (
    <Container>
      <BackButton to={"/account/details"}>
        {t("account:returnToAccount")}
      </BackButton>
      <AddressesList />
      <AddButton onClick={addAddress}>{t("account:addAddress")}</AddButton>
    </Container>
  );
}
