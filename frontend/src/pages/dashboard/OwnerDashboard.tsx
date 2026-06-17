import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Calendar, Plus, Trash2, X, Star, Pencil } from 'lucide-react';
import { animalService } from '../../api/animalService';
import { bookingService } from '../../api/bookingService';
import { reviewService } from '../../api/reviewService';
import type { Animal, Booking, BookingWithRelations } from '../../types/index';
import { SPECIES_EMOJI, ANIMAL_LABELS, STATUS_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

interface Props {
  animals: Animal[];
  bookings: BookingWithRelations[];
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
  setBookings: React.Dispatch<React.SetStateAction<BookingWithRelations[]>>;
}

export default function OwnerDashboard({ animals, bookings, setAnimals, setBookings }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', species: 'dog', age: '', breed: '', description: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const animal = await animalService.create({
        name: addForm.name,
        species: addForm.species,
        age: Number(addForm.age),
        ...(addForm.breed && { breed: addForm.breed }),
        ...(addForm.description && { description: addForm.description }),
      });
      setAnimals(prev => [...prev, animal]);
      setShowAddModal(false);
      setAddForm({ name: '', species: 'dog', age: '', breed: '', description: '' });
    } catch {
      setAddError("Erreur lors de l'ajout.");
    } finally {
      setAddLoading(false);
    }
  };

  const [editAnimal, setEditAnimal] = useState<Animal | null>(null);
  const [editAnimalForm, setEditAnimalForm] = useState({ name: '', species: 'dog', age: '', breed: '', description: '' });
  const [editAnimalLoading, setEditAnimalLoading] = useState(false);
  const [editAnimalError, setEditAnimalError] = useState('');

  const openEditAnimal = (animal: Animal) => {
    setEditAnimalForm({
      name: animal.name,
      species: animal.species,
      age: String(animal.age),
      breed: animal.breed ?? '',
      description: animal.description ?? '',
    });
    setEditAnimal(animal);
  };

  const handleEditAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAnimal) return;
    setEditAnimalLoading(true);
    setEditAnimalError('');
    try {
      const updated = await animalService.update(editAnimal.id, {
        name: editAnimalForm.name,
        species: editAnimalForm.species,
        age: Number(editAnimalForm.age),
        breed: editAnimalForm.breed || undefined,
        description: editAnimalForm.description || undefined,
      });
      setAnimals(prev => prev.map(a => (a.id === editAnimal.id ? updated : a)));
      setEditAnimal(null);
    } catch {
      setEditAnimalError("Erreur lors de la modification.");
    } finally {
      setEditAnimalLoading(false);
    }
  };

  const handleCancelBooking = (id: number) => {
    bookingService.updateStatus(id, 'cancelled').then(() => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as Booking['status'] } : b));
    });
  };

  const [reviewModal, setReviewModal] = useState<{ bookingId: number; sitterName: string } | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set());

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      await reviewService.create({
        bookingId: reviewModal.bookingId,
        rating: reviewForm.rating,
        ...(reviewForm.comment && { comment: reviewForm.comment }),
      });
      setReviewedIds(prev => new Set(prev).add(reviewModal.bookingId));
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteAnimal = async (id: number) => {
    if (!confirm('Supprimer cet animal ?')) return;
    try {
      await animalService.remove(id);
      setAnimals(prev => prev.filter(a => a.id !== id));
    } catch {
      // silently ignore
    }
  };

  return (
    <>
      {/* Animaux */}
      <section className="homepage__section">
        <div className="homepage__section-header">
          <h2 className="homepage__section-title">
            <PawPrint size={20} /> Mes animaux
          </h2>
          <div className="homepage__section-actions">
            <button className="hp-btn-add" onClick={() => setShowAddModal(true)}>
              <Plus size={15} /> Ajouter un animal
            </button>
            <Link to="/sitters" className="homepage__cta-link">
              Trouver un sitter →
            </Link>
          </div>
        </div>

        {animals.length === 0 ? (
          <div className="homepage__empty">
            <div className="homepage__empty-icon">🐾</div>
            <p>Aucun animal enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="homepage__animals-grid">
            {animals.map(animal => (
              <div key={animal.id} className="homepage__animal-card">
                <div className="homepage__animal-actions">
                  <button className="homepage__animal-edit" onClick={() => openEditAnimal(animal)} title="Modifier">
                    <Pencil size={13} />
                  </button>
                  <button className="homepage__animal-delete" onClick={() => handleDeleteAnimal(animal.id)} title="Supprimer">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="homepage__animal-emoji">{SPECIES_EMOJI[animal.species]}</div>
                <div className="homepage__animal-name">{animal.name}</div>
                <div className="homepage__animal-detail">
                  {animal.breed || ANIMAL_LABELS[animal.species]} · {animal.age} an{animal.age > 1 ? 's' : ''}
                </div>
                {animal.description && (
                  <div className="homepage__animal-desc">{animal.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Réservations */}
      <section className="homepage__section">
        <div className="homepage__section-header">
          <h2 className="homepage__section-title">
            <Calendar size={20} /> Mes réservations
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="homepage__empty">
            <div className="homepage__empty-icon">📅</div>
            <p>Aucune réservation pour le moment.</p>
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
                    avec{' '}
                    {booking.sitter
                      ? `${booking.sitter.firstName} ${booking.sitter.lastName}`
                      : 'le sitter'}
                  </div>
                  <div className="homepage__booking-dates">
                    <Calendar size={13} />
                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                  </div>
                </div>
                <div className="homepage__booking-right">
                  <span className={`hp-badge hp-badge--${booking.status}`}>
                    {STATUS_LABELS[booking.status]}
                  </span>
                  <span className="homepage__booking-price">
                    {Number(booking.totalPrice).toFixed(0)} €
                  </span>
                  {booking.status === 'pending' && (
                    <button className="hp-btn-cancel-booking" onClick={() => handleCancelBooking(booking.id)}>
                      Annuler
                    </button>
                  )}
                  {(booking.status === 'confirmed' || booking.status === 'completed') && !reviewedIds.has(booking.id) && (
                    <button
                      className="hp-btn-review"
                      onClick={() => {
                        setReviewForm({ rating: 5, comment: '' });
                        setReviewModal({
                          bookingId: booking.id,
                          sitterName: booking.sitter
                            ? `${booking.sitter.firstName} ${booking.sitter.lastName}`
                            : 'ce sitter',
                        });
                      }}
                    >
                      <Star size={13} /> Avis
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal ajout animal */}
      {editAnimal && (
        <div className="hp-modal-overlay" onClick={() => setEditAnimal(null)}>
          <div className="hp-modal" onClick={e => e.stopPropagation()}>
            <div className="hp-modal__header">
              <h3>Modifier {editAnimal.name}</h3>
              <button className="hp-modal__close" onClick={() => setEditAnimal(null)}><X size={20} /></button>
            </div>
            <form className="hp-modal__form" onSubmit={handleEditAnimal}>
              <div className="hp-modal__field">
                <label>Nom *</label>
                <input type="text" value={editAnimalForm.name} onChange={e => setEditAnimalForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="hp-modal__row">
                <div className="hp-modal__field">
                  <label>Espèce *</label>
                  <select value={editAnimalForm.species} onChange={e => setEditAnimalForm(f => ({ ...f, species: e.target.value }))}>
                    <option value="dog">🐕 Chien</option>
                    <option value="cat">🐈 Chat</option>
                    <option value="other">🐾 Autre</option>
                  </select>
                </div>
                <div className="hp-modal__field">
                  <label>Âge *</label>
                  <input type="number" min="0" value={editAnimalForm.age} onChange={e => setEditAnimalForm(f => ({ ...f, age: e.target.value }))} required />
                </div>
              </div>
              <div className="hp-modal__field">
                <label>Race <span className="hp-modal__optional">(optionnel)</span></label>
                <input type="text" value={editAnimalForm.breed} onChange={e => setEditAnimalForm(f => ({ ...f, breed: e.target.value }))} placeholder="Ex : Labrador" />
              </div>
              <div className="hp-modal__field">
                <label>Description <span className="hp-modal__optional">(optionnel)</span></label>
                <textarea value={editAnimalForm.description} onChange={e => setEditAnimalForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              {editAnimalError && <p className="hp-modal__error">{editAnimalError}</p>}
              <button type="submit" className="hp-modal__submit" disabled={editAnimalLoading}>
                {editAnimalLoading ? 'Sauvegarde…' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {reviewModal && (
        <div className="hp-modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="hp-modal" onClick={e => e.stopPropagation()}>
            <div className="hp-modal__header">
              <h3>Avis pour {reviewModal.sitterName}</h3>
              <button className="hp-modal__close" onClick={() => setReviewModal(null)}>
                <X size={20} />
              </button>
            </div>
            <form className="hp-modal__form" onSubmit={handleReview}>
              <div className="hp-modal__field">
                <label>Note</label>
                <div className="hp-star-picker">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`hp-star ${n <= reviewForm.rating ? 'hp-star--active' : ''}`}
                      onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="hp-modal__field">
                <label>Commentaire <span className="hp-modal__optional">(optionnel)</span></label>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Votre expérience avec ce sitter…"
                  rows={3}
                />
              </div>
              {reviewError && <p className="hp-modal__error">{reviewError}</p>}
              <button type="submit" className="hp-modal__submit" disabled={reviewLoading}>
                {reviewLoading ? 'Envoi…' : "Publier l'avis"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="hp-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="hp-modal" onClick={e => e.stopPropagation()}>
            <div className="hp-modal__header">
              <h3>Ajouter un animal</h3>
              <button className="hp-modal__close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="hp-modal__form" onSubmit={handleAddAnimal}>
              <div className="hp-modal__field">
                <label>Nom *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex : Luna"
                  required
                />
              </div>
              <div className="hp-modal__row">
                <div className="hp-modal__field">
                  <label>Espèce *</label>
                  <select
                    value={addForm.species}
                    onChange={e => setAddForm(f => ({ ...f, species: e.target.value }))}
                  >
                    <option value="dog">🐕 Chien</option>
                    <option value="cat">🐈 Chat</option>
                    <option value="other">🐾 Autre</option>
                  </select>
                </div>
                <div className="hp-modal__field">
                  <label>Âge *</label>
                  <input
                    type="number"
                    min="0"
                    value={addForm.age}
                    onChange={e => setAddForm(f => ({ ...f, age: e.target.value }))}
                    placeholder="En années"
                    required
                  />
                </div>
              </div>
              <div className="hp-modal__field">
                <label>Race <span className="hp-modal__optional">(optionnel)</span></label>
                <input
                  type="text"
                  value={addForm.breed}
                  onChange={e => setAddForm(f => ({ ...f, breed: e.target.value }))}
                  placeholder="Ex : Labrador"
                />
              </div>
              <div className="hp-modal__field">
                <label>Description <span className="hp-modal__optional">(optionnel)</span></label>
                <textarea
                  value={addForm.description}
                  onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Allergies, habitudes, caractère…"
                  rows={3}
                />
              </div>
              {addError && <p className="hp-modal__error">{addError}</p>}
              <button type="submit" className="hp-modal__submit" disabled={addLoading}>
                {addLoading ? 'Ajout en cours…' : 'Ajouter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}