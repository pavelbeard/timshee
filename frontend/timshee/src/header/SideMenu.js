import {useDispatch} from "react-redux"
import {toggleMenu} from "../redux/slices/menuSlice";
import NavList from "./NavList";
import InfoList from "./InfoList";

import closeMenuImg from "../media/static_images/cruz.svg"
import "./SideBars.css";
import "../main/Main.css";


const SideMenu = () => {
    const dispatch = useDispatch();

    const closeMenu = () => {
        dispatch(toggleMenu());
    }

    return (
        <div className="overlay">
            <div className="side-menu-container">
                <header className="side-menu-header">
                    <img src={closeMenuImg} alt="close" height={20} onClick={closeMenu}/>
                </header>
                <div className="side-menu">
                    <NavList />
                    <InfoList itIsPartOfSideMenu={true}/>
                </div>
            </div>
        </div>
    )
};

export default SideMenu;