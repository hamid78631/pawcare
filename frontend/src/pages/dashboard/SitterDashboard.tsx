import { useState } from 'react';
import { PawPrint, Calendar, MapPin, CheckCircle, XCircle, X, Pencil } from 'lucide-react';
import { sitterService } from '../../api/sitterService';
import { bookingService } from '../../api/bookingService';
import { useAuth } from '../../context/AuthContext';
import type { Booking, SitterProfile, BookingWithRelations } from '../../types/index';
import { SPECIES_EMOJI, ANIMAL_LABELS, STATUS_LABELS } from '../../utils/constants';
import { getInitials, formatDate } from '../../utils/formatters';

interface Props {
  profile: SitterProfile | null;
  bookings: BookingWithRelations[];
  setProfile: React.Dispatch<React.SetStateAction<SitterProfile | null>>;
  setBookings: React.Dispatch<React.SetStateAction<BookingWithRelations[]>>;
}

export default function SitterDashboard({ profile, bookings, setProfile, setBookings }: Props) {
  const { user } = useAuth();

  const [createForm, setCreateForm] = useState({ bio: '', hourlyRate: '', city: '', acceptedAnimalTypes: [] as string[] });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      const profile = await sitterService.create({
        bio: createForm.bio || undefined,
        hourlyRate: Number(createForm.hourlyRate),
        city: createForm.city || undefined,
        acceptedAnimalTypes: createForm.acceptedAnimalTypes,
      });
      setProfile(profile);
    } catch {
      setCreateError('Erreur lors de la création du profil.');
    } finally {
      setCreateLoading(false);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    hourlyRate: '',
    city: '',
    acceptedAnimalTypes: [] as string[],
    isAvailable: true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const openEditModal = () => {
    setEditForm({
      bio: profile?.bio || '',
      hourlyRate: profile ? String(profile.hourlyRate) : '',
      city: profile?.city || '',
      acceptedAnimalTypes: profile?.acceptedAnimalTypes || [],
      isAvailable: profile?.isAvailable ?? true,
    });
    setShowEditModal(true);
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const updated = await sitterService.update({
        bio: editForm.bio,
        hourlyRate: Number(editForm.hourlyRate),
        city: editForm.city,
        acceptedAnimalTypes: editForm.acceptedAnimalTypes,
        isAvailable: editForm.isAvailable,
      });
      setProfile(updated);
      setShowEditModal(false);
    } catch {
      setEditError('Erreur lors de la mise à jour.');
    } finally {
      setEditLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) => {
    bookingService.updateStatus(id, status).then(() => {
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: status as Booking['status'] } : b))
      );
    });
  };

  return (
    <>
      {/* Profil sitter */}
      <section className="homepage__section">
        <div className="homepage__section-header">
          <h2 className="homepage__section-title">
            <PawPrint size={20} /> Mon profil sitter
          </h2>
          {profile && (
            <button className="hp-btn-edit" onClick={openEditModal}>
              <Pencil size={14} /> Modifier
            </button>
          )}
        </div>

        {profile ? (
          <div className="homepage__profile-card">
            <div className="homepage__profile-top">
              <div className="homepage__profile-avatar">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="homepage__profile-meta">
                <div className="homepage__profile-name">
                  {user?.firstName} {user?.lastName}
                </div>
                {profile.city && (
                  <div className="homepage__profile-city">
                    <MapPin size={13} /> {profile.city}
                  </div>
                )}
                <div className="homepage__profile-rate">
                  {Number(profile.hourlyRate).toFixed(0)} €/nuit
                </div>
              </div>
              <span className={`hp-badge ${profile.isAvailable ? 'hp-badge--confirmed' : 'hp-badge--cancelled'}`}>
                {profile.isAvailable ? 'Disponible' : 'Indisponible'}
              </span>
            </div>

            {profile.bio && (
              <p className="homepage__profile-bio">{profile.bio}</p>
            )}

            {profile.acceptedAnimalTypes && profile.acceptedAnimalTypes.length > 0 && (
              <div className="homepage__profile-tags">
                {profile.acceptedAnimalTypes.map((t: string) => (
                  <span key={t} className="homepage__profile-tag">
                    {SPECIES_EMOJI[t]} {ANIMAL_LABELS[t]}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="hp-create-profile">
            <div className="hp-create-profile__intro">
              <div className="homepage__empty-icon">🐾</div>
              <p>Votre profil sitter n'est pas encore configuré. Remplissez les informations ci-dessous pour apparaître dans les recherches.</p>
            </div>
            <form className="hp-modal__form" onSubmit={handleCreateProfile}>
              <div className="hp-modal__field">
                <label>Bio <span className="hp-modal__optional">(optionnel)</span></label>
                <textarea
                  value={createForm.bio}
                  onChange={e => setCreateForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Décrivez-vous, votre expérience avec les animaux…"
                  rows={3}
                />
              </div>
              <div className="hp-modal__row">
                <div className="hp-modal__field">
                  <label>Tarif (€/nuit) *</label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.hourlyRate}
                    onChange={e => setCreateForm(f => ({ ...f, hourlyRate: e.target.value }))}
                    placeholder="Ex : 25"
                    required
                  />
                </div>
                <div className="hp-modal__field">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={createForm.city}
                    onChange={e => setCreateForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Paris, Lyon…"
                  />
                </div>
              </div>
              <div className="hp-modal__field">
                <label>Animaux acceptés</label>
                <div className="hp-modal__checkboxes">
                  {(['dog', 'cat', 'other'] as const).map(type => (
                    <label key={type} className="hp-modal__checkbox-label">
                      <input
                        type="checkbox"
                        checked={createForm.acceptedAnimalTypes.includes(type)}
                        onChange={e => setCreateForm(f => ({
                          ...f,
                          acceptedAnimalTypes: e.target.checked
                            ? [...f.acceptedAnimalTypes, type]
                            : f.acceptedAnimalTypes.filter(t => t !== type),
                        }))}
                      />
                      {SPECIES_EMOJI[type]} {ANIMAL_LABELS[type]}
                    </label>
                  ))}
                </div>
              </div>
              {createError && <p className="hp-modal__error">{createError}</p>}
              <button type="submit" className="hp-modal__submit" disabled={createLoading}>
                {createLoading ? 'Création…' : 'Créer mon profil'}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Réservations entrantes */}
      <section className="homepage__section">
        <div className="homepage__section-header">
          <h2 className="homepage__section-title">
            <Calendar size={20} /> Réservations reçues
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="homepage__empty">
            <div className="homepage__empty-icon">📅</div>
            <p>Aucune demande de réservation pour le moment.</p>
          </div>
        ) : (
          <div className="homepage__bookings-list">
            {bookings.map(booking => (
              <div key={booking.id} className="homepage__booking-card">
                <div className="homepage__booking-info">
                  <div className="homepage__booking-title">
                    {booking.animal
                      ? `${SPECIES_EMOJI[booking.animal.species]} ${booking.animal.name}`
                      : 'Animal'}{' '}
                    de{' '}
                    {booking.owner
                      ? `${booking.owner.firstName} ${booking.owner.lastName}`
                      : "l'owner"}
                  </div>
                  <div className="homepage__booking-dates">
                    <Calendar size={13} />
                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                  </div>
                  {booking.message && (
                    <div className="homepage__booking-message">"{booking.message}"</div>
                  )}
                  {booking.status === 'pending' && (
                    <div className="homepage__booking-actions">
                      <button
                        className="hp-btn-confirm"
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                      >
                        <CheckCircle size={14} /> Confirmer
                      </button>
                      <button
                        className="hp-btn-cancel"
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                      >
                        <XCircle size={14} /> Refuser
                      </button>
                    </div>
                  )}
                </div>
                <div className="homepage__booking-right">
                  <span className={`hp-badge hp-badge--${booking.status}`}>
                    {STATUS_LABELS[booking.status]}
                  </span>
                  <span className="homepage__booking-price">
                    {Number(booking.totalPrice).toFixed(0)} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal édition profil */}
      {showEditModal && (
        <div className="hp-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="hp-modal" onClick={e => e.stopPropagation()}>
            <div className="hp-modal__header">
              <h3>Modifier mon profil</h3>
              <button className="hp-modal__close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="hp-modal__form" onSubmit={handleEditProfile}>
              <div className="hp-modal__field">
                <label>Bio <span className="hp-modal__optional">(optionnel)</span></label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Décrivez-vous, vos animaux, votre expérience…"
                  rows={3}
                />
              </div>
              <div className="hp-modal__row">
                <div className="hp-modal__field">
                  <label>Tarif (€/nuit) *</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.hourlyRate}
                    onChange={e => setEditForm(f => ({ ...f, hourlyRate: e.target.value }))}
                    required
                  />
                </div>
                <div className="hp-modal__field">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Paris, Lyon…"
                  />
                </div>
              </div>
              <div className="hp-modal__field">
                <label>Animaux acceptés</label>
                <div className="hp-modal__checkboxes">
                  {(['dog', 'cat', 'other'] as const).map(type => (
                    <label key={type} className="hp-modal__checkbox-label">
                      <input
                        type="checkbox"
                        checked={editForm.acceptedAnimalTypes.includes(type)}
                        onChange={e => setEditForm(f => ({
                          ...f,
                          acceptedAnimalTypes: e.target.checked
                            ? [...f.acceptedAnimalTypes, type]
                            : f.acceptedAnimalTypes.filter(t => t !== type),
                        }))}
                      />
                      {SPECIES_EMOJI[type]} {ANIMAL_LABELS[type]}
                    </label>
                  ))}
                </div>
              </div>
              <label className="hp-modal__toggle-label">
                <input
                  type="checkbox"
                  checked={editForm.isAvailable}
                  onChange={e => setEditForm(f => ({ ...f, isAvailable: e.target.checked }))}
                />
                Disponible pour des gardes
              </label>
              {editError && <p className="hp-modal__error">{editError}</p>}
              <button type="submit" className="hp-modal__submit" disabled={editLoading}>
                {editLoading ? 'Sauvegarde…' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
