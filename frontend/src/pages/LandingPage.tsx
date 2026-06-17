import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Heart, Star, Clock, PawPrint, MapPin, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LandingPage.css';
import { useAuth } from '../context/AuthContext';
import dog1 from '../assets/dogs/dog1.jpg';
import dog2 from '../assets/dogs/dog2.jpg';
import dog3 from '../assets/dogs/dog3.jpg';
import whyImg from '../assets/dogs/image.png';
import howImg1 from '../assets/danger/undraw_job-offers_55y0.png';
import howImg2 from '../assets/danger/undraw_booking_8vl5.png';
import howImg3 from '../assets/danger/undraw_ideas-flow_lwpa.png';

export default function LandingPage() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const {user } = useAuth();
  const handleSearch = () => {
    if (city.trim()) {
      navigate(`/sitters?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">

          {/* Bulles photos */}
          <div className="hero__visuals">
            <svg className="hero__connector" viewBox="0 0 460 640" fill="none">
              <path d="M 165 155 C 125 300 110 420 105 535" stroke="rgba(45,106,79,0.22)" strokeWidth="2.5" strokeDasharray="7 5" />
              <path d="M 165 155 C 250 210 300 270 335 320" stroke="rgba(45,106,79,0.22)" strokeWidth="2.5" strokeDasharray="7 5" />
            </svg>
            <div className="hero__bubble hero__bubble--1">
              <img src={dog1} alt="Chien gardé" />
            </div>
            <div className="hero__bubble hero__bubble--2">
              <img src={dog2} alt="Animal aimé" />
            </div>
            <div className="hero__bubble hero__bubble--3">
              <img src={dog3} alt="Sitter de confiance" />
            </div>
          </div>

          {/* Texte */}
          <div className="hero__content">
            <div className="hero__tag">
              <PawPrint size={15} />
              La garde d'animaux réinventée
            </div>
            <h1 className="hero__title">
              Votre animal mérite<br /><span>le meilleur soin</span>
            </h1>
            <p className="hero__desc">
              Trouvez un sitter de confiance près de chez vous — vérifié, noté,
              et passionné par les animaux.
            </p>
            <div className="hero__pills">
              <span className="hero__pill"><Star size={13} /> 4.9/5 · 15 000+ gardes</span>
              <span className="hero__pill"><Shield size={13} /> Sitters vérifiés</span>
            </div>
            <div className="hero__search">
              <input
                type="text"
                placeholder="Votre ville (ex: Paris, Lyon...)"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Rechercher</button>
            </div>
            {!user && (
              <Link to="/register" className="hero__link">
                Vous êtes sitter ? Rejoignez-nous →
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stats__inner">
          {[
            { icon: <Users size={22} />, number: '2 500+', label: 'Sitters vérifiés' },
            { icon: <Star size={22} />, number: '4.9/5', label: 'Note moyenne' },
            { icon: <PawPrint size={22} />, number: '15 000+', label: 'Gardes réalisées' },
            { icon: <MapPin size={22} />, number: '85+', label: 'Villes couvertes' },
          ].map(s => (
            <div key={s.label} className="stats__item">
              <div className="stats__icon">{s.icon}</div>
              <div className="stats__number">{s.number}</div>
              <div className="stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment ça marche */}
      <section id="how" className="how">
        <div className="how__header">
          <h2 className="section__title">Comment ça marche ?</h2>
          <p className="section__subtitle">En 3 étapes simples</p>
        </div>

        <div className="how__flow">

          {/* Courbe SVG avec pointillés denses */}
          <svg className="how__path-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M 17 10 C 26 2, 40 18, 50 10 C 60 2, 74 18, 83 10"
              stroke="rgba(45,106,79,0.4)"
              strokeWidth="0.4"
              strokeDasharray="0.4 0.9"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {[
            { n: '01', title: 'Recherchez', desc: 'Trouvez des sitters disponibles près de chez vous.', shape: '1', img: howImg1 },
            { n: '02', title: 'Réservez',   desc: 'Envoyez une demande et confirmez la garde en quelques clics.', shape: '2', img: howImg2 },
            { n: '03', title: 'Notez',      desc: 'Après la garde, laissez un avis pour aider la communauté.', shape: '3', img: howImg3 },
          ].map(item => (
            <div key={item.n} className="how__step">
              <div className={`how__img-placeholder how__img-placeholder--${item.shape}`}>
                <img src={item.img} alt={item.title} className="how__img" />
              </div>
              <div className="how__text">
                <span className="how__step-badge">{item.n}</span>
                <h3 className="how__step-title">{item.title}</h3>
                <p className="how__step-desc">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Pourquoi nous */}
      <section id="why" className="why">

        <div className="why__header">
          <h2 className="why__title">Pourquoi choisir PawCare ?</h2>
          <p className="why__subtitle">La sécurité de votre animal, notre priorité</p>
        </div>

        <div className="why__inner">

          {/* Gauche — 4 bulles raisons */}
          <div className="why__bubbles-grid">
            {[
              { icon: <Shield size={26} />, title: 'Sitters vérifiés' },
              { icon: <Clock size={26} />,  title: 'Disponible 7j/7' },
              { icon: <Heart size={26} />,  title: 'Passion animale' },
              { icon: <Star size={26} />,   title: 'Avis vérifiés' },
            ].map((item, i) => (
              <div key={item.title} className={`why__reason-bubble why__reason-bubble--${i + 1}`}>
                <div className="why__reason-icon">{item.icon}</div>
                <span className="why__reason-title">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Droite — grande bulle image */}
          <div className="why__visuals">
            <div className="why__img-bubble">
              <img src={whyImg} alt="Sitter avec animal" className="why__img" />
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <PawPrint size={48} className="cta__icon" />
        <h2>{user ? (user.role === 'owner' ? 'Trouvez le sitter parfait' : 'Gérez vos réservations') : 'Prêt à confier votre animal ?'}</h2>
        <p>{user ? (user.role === 'owner' ? 'Parcourez nos sitters vérifiés et réservez en quelques clics.' : 'Consultez les demandes entrantes et gérez votre agenda.') : 'Rejoignez des milliers de propriétaires qui font confiance à PawCare.'}</p>
        <Link
          to={user ? (user.role === 'owner' ? '/sitters' : '/home') : '/register'}
          className="btn-primary"
        >
          {user ? (user.role === 'owner' ? 'Voir les sitters' : 'Mon dashboard') : 'Commencer maintenant'}
        </Link>
      </section>

      <Footer />
    </div>
  );
}
