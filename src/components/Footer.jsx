import "../styles/Footer.css";
import TMDBlogo from "../assets/images/tmdb_logo.svg";

const Footer = () => {
  return (
    <footer>
      <img src={TMDBlogo} />
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
};

export default Footer;
