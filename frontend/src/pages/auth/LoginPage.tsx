import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import birdGif from '../../assets/register/pablita-flying-birdie.gif';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post<{ access_token: string }>('/auth/login', { email, password });
      await login(res.data.access_token);
      navigate('/home');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Filigrane empreinte */}
      <PawPrint className="login-watermark" />

      {/* Bulles décoratives */}
      <div className="login-bubble bubble-1" />
      <div className="login-bubble bubble-2" />
      <div className="login-bubble bubble-3" />

      <div className="login-card">

        {/* Oiseau au-dessus */}
        <div className="login-bird-wrapper">
          <img src={birdGif} alt="oiseau" className="login-bird" />
        </div>

        {/* Logo */}
        <div className="login-logo">
          <PawPrint size={22} />
          PawCare
        </div>

        <h1 className="login-title">Bon retour parmi nous</h1>
        <p className="login-subtitle">Vos animaux vous ont manqué 🐾</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <Mail size={18} className="login-input-icon" />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <Lock size={18} className="login-input-icon" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="login-footer">
          Pas encore de compte ?{' '}
          <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
