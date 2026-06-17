import { Link } from 'react-router-dom';
import { PawPrint, ArrowLeft, Bone, Cat, Dog } from 'lucide-react';
import walkingDog from '../assets/register/walking-with-dog-near-london-eye-city-walk-and-leisure-activity-1.gif';
import './NotFoundPage.css';

const floatingElements = [
  { icon: <PawPrint />, className: 'float-el el-1' },
  { icon: <PawPrint />, className: 'float-el el-2' },
  { icon: <Bone />,     className: 'float-el el-3' },
  { icon: <PawPrint />, className: 'float-el el-4' },
  { icon: <Cat />,      className: 'float-el el-5' },
  { icon: <PawPrint />, className: 'float-el el-6' },
  { icon: <Dog />,      className: 'float-el el-7' },
  { icon: <Bone />,     className: 'float-el el-8' },
  { icon: <PawPrint />, className: 'float-el el-9' },
  { icon: <PawPrint />, className: 'float-el el-10' },
];

export default function NotFoundPage() {
  return (
    <div className="notfound-page">

      {/* Éléments flottants sur les bords */}
      {floatingElements.map((el, i) => (
        <div key={i} className={el.className}>{el.icon}</div>
      ))}

      <div className="notfound-container">
        <div className="notfound-code">
          <span>4</span>
          <PawPrint size={80} className="notfound-paw" />
          <span>4</span>
        </div>

        <img src={walkingDog} alt="Chien qui se promène" className="notfound-image" />

        <h1 className="notfound-title">On s'est perdus en chemin...</h1>
        <p className="notfound-desc">
          Cette page n'existe pas ou a été déplacée.
          Votre compagnon vous attend ailleurs !
        </p>

        <Link to="/" className="notfound-btn">
          <ArrowLeft size={18} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
