import Contacts from './Contacts';
import SocialNetworks from './SocialNetworks';
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <Contacts />
            <SocialNetworks />
        </div>
    );
}

export default Footer;