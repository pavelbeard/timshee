import { clsx } from "clsx";
import { useWindowSize } from "../lib/hooks";
import HeaderWithBurgerMenu from "./ui/header/HeaderWithBurgerMenu";
import Logo from "./ui/header/Logo";
import MenuLeft from "./ui/header/MenuLeft";
import MenuRight from "./ui/header/MenuRight";
import MenuUnderHeader from "./ui/header/MenuUnderHeader";

const Header = () => {
  const { width } = useWindowSize();
  const lgStyle = {
    header: clsx("lg:grid lg:grid-cols-3 lg:p-6 lg:justify-between"),
  };

  const lg = (
    <div className="lg:flex lg:flex-col">
      <div className={lgStyle.header}>
        <MenuLeft />
        <Logo className="flex items-center justify-center" />
        <MenuRight />
      </div>
      <div>
        <MenuUnderHeader />
      </div>
    </div>
  );

  return (
    <header>
      {width <= 1024 && <HeaderWithBurgerMenu />}
      {width > 1024 && lg}
    </header>
  );
};

export default Header;
