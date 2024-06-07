import React from 'react';
import {Link} from "react-router-dom";
import {useEffect} from "react";

import "./Logo.css";
import pngLogo from '../media/static_images/logo.png';


const Logo = () => {
    const [logoSize, setLogoSize] = React.useState("");

    useEffect(() => {
        const changeLogoSize = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setLogoSize("92");
            } else {
                setLogoSize("128");
            }
        }

        changeLogoSize();
        window.addEventListener("resize", changeLogoSize);
        return () => window.removeEventListener("resize", changeLogoSize);
    }, []);

    return (
        <div className="logo">
            <Link to="/">
                <img src={pngLogo} alt="timshee-logo" width={logoSize}/>
            </Link>
        </div>
    )
}

export default Logo;