import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__copy">© {new Date().getFullYear()} PawCare — Tous droits réservés</span>
        <div className="footer__links">
          <Link to="/terms">Conditions d'utilisation</Link>
          <span className="footer__sep">·</span>
          <a href="mailto:contact@pawcare.fr">Contact</a>
        </div>
      </div>
    </footer>
  );
}
