import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Mail, Lock, User, UserPlus, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './RegisterPage.css';
import megaCreator from '../../assets/register/active-young-woman-cradling-a-cat.gif';

export default function RegisterPage() {
  const [role, setRole] = useState<'owner' | 'sitter'>('owner');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/register', { firstName, lastName, email, password, city, role });
      const res = await api.post<{ access_token: string }>('/auth/login', { email, password });
      await login(res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />

      <div className="register-layout">
        {/* Bloc Visuel */}
        <div className="register-visual">
          <div className="visual-content">
            <h2 className="visual-title">Rejoignez la meute ! 🐾</h2>
            <p className="visual-desc">
              Des milliers d'animaux et de passionnés n'attendent plus que vous sur PawCare.
            </p>
            <div className="animated-image-wrapper">
              <img src={megaCreator} alt="Illustration animaux" className="pet-gif-image" />
              <PawPrint className="bg-motif paw-1" size={48} />
              <PawPrint className="bg-motif paw-2" size={32} />
              <PawPrint className="bg-motif paw-3" size={64} />
            </div>
          </div>
        </div>

        {/* Bloc Formulaire */}
        <div className="register-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Créer un compte</h2>
              <p>Rejoignez la communauté PawCare en quelques clics.</p>
            </div>

            {error && <div className="form-error">{error}</div>}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${role === 'owner' ? 'active' : ''}`}
                  onClick={() => setRole('owner')}
                >
                  Je suis Propriétaire
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'sitter' ? 'active' : ''}`}
                  onClick={() => setRole('sitter')}
                >
                  Je suis Sitter
                </button>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Votre ville"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  placeholder="Mot de passe (6 caractères min.)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>J'accepte les <Link to="/terms">conditions d'utilisation</Link></span>
                </label>
              </div>

              <button type="submit" className="btn-submit" disabled={isLoading}>
                <UserPlus size={20} />
                {isLoading ? 'Inscription en cours...' : "S'inscrire"}
              </button>
            </form>

            <div className="form-footer">
              <p>
                Déjà un compte ?{' '}
                <Link to="/login" className="login-link">Connectez-vous</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
