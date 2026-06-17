import { useState } from 'react';
import { MapPin, CheckCircle, Eye, EyeOff, Shield, Pencil } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/userService';
import { getInitials } from '../utils/formatters';
import './AccountPage.css';

type Tab = 'profile' | 'password';

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    city: user?.city ?? '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      await userService.updateMe({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        city: profileForm.city || undefined,
      });
      await refreshUser();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      setProfileError('Erreur lors de la mise à jour.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPwLoading(true);
    setPwError('');
    setPwSuccess(false);
    try {
      await userService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err?.response?.data?.message ?? 'Erreur lors du changement de mot de passe.');
    } finally {
      setPwLoading(false);
    }
  };

  if (!user) return null;

  const pwStrength = pwForm.newPassword.length === 0 ? 0
    : pwForm.newPassword.length < 6 ? 1
    : pwForm.newPassword.length < 10 ? 2
    : 3;

  return (
    <div className="account-page">
      <Navbar />

      {/* Hero */}
      <div className="account__hero">
        <div className="account__hero-inner">
          <div className="account__avatar-wrap">
            <div className="account__avatar">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="account__avatar-badge">
              <Pencil size={12} />
            </div>
          </div>
          <div className="account__hero-info">
            <h1 className="account__hero-name">{user.firstName} {user.lastName}</h1>
            <div className="account__hero-meta">
              <span className="account__hero-role">
                {user.role === 'owner' ? 'Propriétaire' : 'Pet-sitter'}
              </span>
              {user.city && (
                <span className="account__hero-city">
                  <MapPin size={13} /> {user.city}
                </span>
              )}
            </div>
            <p className="account__hero-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="account__tabs-wrap">
        <div className="account__tabs">
          <button
            className={`account__tab ${tab === 'profile' ? 'account__tab--active' : ''}`}
            onClick={() => setTab('profile')}
          >
            Mon profil
          </button>
          <button
            className={`account__tab ${tab === 'password' ? 'account__tab--active' : ''}`}
            onClick={() => setTab('password')}
          >
            <Shield size={15} /> Sécurité
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="account__content">

        {tab === 'profile' && (
          <form className="account__form" onSubmit={handleProfile}>
            <div className="account__section-label">Informations personnelles</div>

            <div className="account__row">
              <div className="account__field">
                <label className="account__label">Prénom</label>
                <input
                  className="account__input"
                  type="text"
                  value={profileForm.firstName}
                  onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="account__field">
                <label className="account__label">Nom</label>
                <input
                  className="account__input"
                  type="text"
                  value={profileForm.lastName}
                  onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="account__field">
              <label className="account__label">Ville</label>
              <input
                className="account__input"
                type="text"
                value={profileForm.city}
                onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))}
                placeholder="Paris, Lyon, Marseille…"
              />
            </div>

            <div className="account__field">
              <label className="account__label">Adresse email</label>
              <input className="account__input account__input--disabled" type="email" value={user.email} disabled />
              <span className="account__hint">L'email ne peut pas être modifié.</span>
            </div>

            <div className="account__form-footer">
              {profileError && <p className="account__error">{profileError}</p>}
              {profileSuccess && (
                <p className="account__success"><CheckCircle size={15} /> Profil mis à jour avec succès.</p>
              )}
              <button type="submit" className="account__btn" disabled={profileLoading}>
                {profileLoading ? 'Sauvegarde…' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        )}

        {tab === 'password' && (
          <form className="account__form" onSubmit={handlePassword}>
            <div className="account__section-label">Changer le mot de passe</div>

            <div className="account__field">
              <label className="account__label">Mot de passe actuel</label>
              <div className="account__input-wrap">
                <input
                  className="account__input"
                  type={showCurrent ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                  required
                  placeholder="••••••••"
                />
                <button type="button" className="account__eye" onClick={() => setShowCurrent(v => !v)}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="account__field">
              <label className="account__label">Nouveau mot de passe</label>
              <div className="account__input-wrap">
                <input
                  className="account__input"
                  type={showNew ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  minLength={8}
                  required
                  placeholder="Minimum 8 caractères"
                />
                <button type="button" className="account__eye" onClick={() => setShowNew(v => !v)}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwForm.newPassword.length > 0 && (
                <div className="account__strength">
                  <div className={`account__strength-bar account__strength-bar--${pwStrength}`} />
                  <span className="account__strength-label">
                    {pwStrength === 1 ? 'Faible' : pwStrength === 2 ? 'Moyen' : 'Fort'}
                  </span>
                </div>
              )}
            </div>

            <div className="account__field">
              <label className="account__label">Confirmer le nouveau mot de passe</label>
              <div className="account__input-wrap">
                <input
                  className={`account__input ${pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword ? 'account__input--error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                  placeholder="••••••••"
                />
                <button type="button" className="account__eye" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
                <span className="account__hint account__hint--error">Les mots de passe ne correspondent pas.</span>
              )}
            </div>

            <div className="account__form-footer">
              {pwError && <p className="account__error">{pwError}</p>}
              {pwSuccess && (
                <p className="account__success"><CheckCircle size={15} /> Mot de passe modifié avec succès.</p>
              )}
              <button type="submit" className="account__btn" disabled={pwLoading}>
                {pwLoading ? 'Modification…' : 'Changer le mot de passe'}
              </button>
            </div>
          </form>
        )}

      </div>

      <Footer />
    </div>
  );
}
