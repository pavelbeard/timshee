const showBurgerMenu = (setIsOpen) => {
    const width = window.innerWidth;
    return width < 768;
};


export default showBurgerMenu;