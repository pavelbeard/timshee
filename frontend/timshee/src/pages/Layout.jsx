import React, {useEffect} from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartModal from "./cart/CartModal";
import {useDispatch, useSelector} from "react-redux";
import VerticalHeader from "../components/ui/header/VerticalHeader";
import {Outlet} from "react-router-dom";
import {
    toggleAddressForm,
    toggleBurgerMenu, toggleCartMenu,
    toggleChangeEmail, toggleFiltersMenu
} from "../redux/features/store/uiControlsSlice";
import AddressForm from "../components/account/addresses/forms/AddressForm";
import Modal from "../components/layout/Modal";
import ChangeEmailForm from "../components/account/forms/ChangeEmailForm";
import FiltersContainerSm from "../components/ui/shop/FiltersContainerSm";


const Layout = () => {
    window.document.title = "Timshee";
    const dispatch = useDispatch();
    const {
        isBurgerMenuOpen,
        isFiltersMenuOpen,
        isChangeEmailFormOpen,
        isAddressFormOpen,
        isCartMenuOpen,
    } = useSelector(s => s.ui);
    const visibility =
        isBurgerMenuOpen ||
        isFiltersMenuOpen ||
        isChangeEmailFormOpen ||
        isAddressFormOpen ||
        isCartMenuOpen;
    const changeOverlay = () => {
        if (visibility) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const closeModal = () => {
        if (isBurgerMenuOpen) dispatch(toggleBurgerMenu(false));
        if (isFiltersMenuOpen) dispatch(toggleFiltersMenu(false));
        if (isChangeEmailFormOpen) dispatch(toggleChangeEmail(false));
        if (isAddressFormOpen) dispatch(toggleAddressForm(false));
        if (isCartMenuOpen) dispatch(toggleCartMenu(false));
    }

    useEffect(() => {
        changeOverlay();
    }, [visibility]);

    return(
        <div className="relative" data-layout="">
            <Header/>
            <Outlet />
            <Footer/>
            <Modal open={visibility} close={closeModal}>
                {isBurgerMenuOpen && <VerticalHeader onClose={closeModal} />}
                {isFiltersMenuOpen && <FiltersContainerSm onClose={closeModal}/>}
                {isChangeEmailFormOpen && <ChangeEmailForm onClose={closeModal}/>}
                {isAddressFormOpen && <AddressForm onClose={closeModal}/>}
                {isCartMenuOpen && <CartModal onClose={closeModal}/>}
            </Modal>
        </div>
    )
}

export default Layout;