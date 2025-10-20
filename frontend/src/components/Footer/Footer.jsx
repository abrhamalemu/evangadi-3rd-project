import classes from "./footer.module.css";
import footerLogo from "../../assets/images/footer-logo.png";
import { FiFacebook } from "react-icons/fi";
import { BiLogoInstagram } from "react-icons/bi";
import { AiOutlineYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <>
      <footer className={classes.footer}>
        <div className={classes.footerContainer}>
          <div className={classes.footerLogo}>
            <img src={footerLogo} alt="Evangadi Logo" />
            <div className={classes.socialIcons}>
              <a href="#">
                <FiFacebook />
              </a>
              <a href="#">
                <BiLogoInstagram />
              </a>
              <a href="#">
                <AiOutlineYoutube/>
              </a>
            </div>
          </div>

          <div className={classes.footerLinks}>
            <h3>Useful Link</h3>
            <a href="#">How it works</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy policy</a>
          </div>

          <div className={classes.footerContact}>
            <h3>Contact Info</h3>
            <p>Evangadi Networks</p>
            <p>
              <a href="mailto:support@evangadi.com">support@evangadi.com</a>
            </p>
            <p>+1-202-386-2702</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
