import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo/Logo1.jpg';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="PawCare" className="navbar__logo-img" />
        </Link>

        {!user && (
          <div className="navbar__links">
            <a href="#how">Comment ça marche</a>
            <a href="#sitters">Nos sitters</a>
            <a href="#why">Pourquoi nous</a>
          </div>
        )}

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/home" className="navbar__nav-link">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/account" className="navbar__nav-link">
                <UserCircle size={15} /> Mon compte
              </Link>
              <button className="navbar__logout" onClick={logout}>
                <LogOut size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="navbar__sitter">Vous êtes sitter ?</Link>
              <Link to="/login" className="navbar__login">Connexion</Link>
              <Link to="/register" className="navbar__register">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
