import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import AddressForm from "../components/account/addresses/forms/AddressForm";
import ChangeEmailForm from "../components/account/forms/ChangeEmailForm";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Modal from "../components/layout/Modal";
import VerticalHeader from "../components/ui/header/VerticalHeader";
import FiltersContainerSm from "../components/ui/shop/FiltersContainerSm";
import { useAppDispatch } from "../lib/hooks";
import {
  toggleAddressForm,
  toggleBurgerMenu,
  toggleCartMenu,
  toggleChangeEmail,
  toggleFiltersMenu,
} from "../redux/features/store/uiControlsSlice";
import CartModal from "./cart/CartModal";

const Layout = () => {
  window.document.title = "Timshee";
  const dispatch = useAppDispatch();
  const {
    isBurgerMenuOpen,
    isFiltersMenuOpen,
    isChangeEmailFormOpen,
    isAddressFormOpen,
    isCartMenuOpen,
  } = useSelector((s) => s.ui);
  const visibility =
    isBurgerMenuOpen ||
    isFiltersMenuOpen ||
    isChangeEmailFormOpen ||
    isAddressFormOpen ||
    isCartMenuOpen;
  const changeOverlay = () => {
    if (visibility) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeModal = () => {
    if (isBurgerMenuOpen) dispatch(toggleBurgerMenu(false));
    if (isFiltersMenuOpen) dispatch(toggleFiltersMenu(false));
    if (isChangeEmailFormOpen) dispatch(toggleChangeEmail(false));
    if (isAddressFormOpen) dispatch(toggleAddressForm(false));
    if (isCartMenuOpen) dispatch(toggleCartMenu(false));
  };

  useEffect(() => {
    changeOverlay();
  }, [visibility]);

  return (
    <div className="relative" data-layout="">
      <Header />
      <Outlet />
      <Footer />
      <Modal open={visibility} close={closeModal}>
        {isBurgerMenuOpen && <VerticalHeader onClose={closeModal} />}
        {isFiltersMenuOpen && <FiltersContainerSm onClose={closeModal} />}
        {isChangeEmailFormOpen && <ChangeEmailForm onClose={closeModal} />}
        {isAddressFormOpen && <AddressForm onClose={closeModal} />}
        {isCartMenuOpen && <CartModal onClose={closeModal} />}
      </Modal>
    </div>
  );
};

export default Layout;
