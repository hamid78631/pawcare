import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, PawPrint, Star, Shield, ArrowLeft, CalendarDays, MessageSquare } from 'lucide-react';
import dangerImg from '../../assets/danger/undraw_notify_drs8.png';
import type { SitterProfile, Animal, Review } from '../../types/index';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { sitterService } from '../../api/sitterService';
import { animalService } from '../../api/animalService';
import { bookingService } from '../../api/bookingService';
import { ANIMAL_LABELS_WITH_EMOJI } from '../../utils/constants';
import { getInitialsFromProfile } from '../../utils/formatters';
import './SitterProfilePage.css';

export default function SitterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sitter, setSitter] = useState<SitterProfile | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchSitter = async () => {
      try {
        const data = await sitterService.getById(Number(id));
        setSitter(data);
        sitterService.getReviews(data.userId).then(setReviews).catch(() => {});
      } catch {
        setError('Sitter introuvable.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSitter();
  }, [id]);

  useEffect(() => {
    if (user?.role === 'owner') {
      animalService.getAll().then(setAnimals).catch(() => {});
    }
  }, [user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBookingLoading(true);
    setBookingError('');
    try {
      await bookingService.create({
        sitterId: sitter!.userId,
        animalId: Number(animalId),
        startDate,
        endDate,
        message: message || undefined,
      });
      setBookingSuccess(true);
    } catch {
      setBookingError('Erreur lors de la réservation. Vérifiez les dates et réessayez.');
    } finally {
      setBookingLoading(false);
    }
  };

  const nights = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0;

  if (isLoading) return (
    <div className="sitter-profile-page">
      <Navbar />
      <div className="sp-loading"><PawPrint size={40} /><p>Chargement...</p></div>
    </div>
  );

  if (error || !sitter) return (
    <div className="sitter-profile-page">
      <Navbar />
      <div className="sp-error">
        <p>{error || 'Sitter introuvable.'}</p>
        <Link to="/sitters" className="sp-back">← Retour aux sitters</Link>
      </div>
    </div>
  );

  const fullName = sitter.user
    ? `${sitter.user.firstName} ${sitter.user.lastName}`
    : 'Sitter PawCare';

  return (
    <div className="sitter-profile-page">
      <Navbar />

      {/* En-tête */}
      <div className="sp-header">
        <div className="sp-header__inner">
          <Link to="/sitters" className="sp-header__back">
            <ArrowLeft size={16} /> Retour
          </Link>

          <div className="sp-header__profile">
            <div className="sp-avatar">{getInitialsFromProfile(sitter)}</div>
            <div className="sp-header__info">
              <h1 className="sp-name">{fullName}</h1>
              {sitter.city && (
                <p className="sp-city"><MapPin size={15} />{sitter.city}</p>
              )}
              <div className="sp-badges">
                {sitter.isAvailable && (
                  <span className="sp-badge sp-badge--available">
                    <Shield size={13} /> Disponible
                  </span>
                )}
                <span className="sp-badge sp-badge--verified">
                  <Star size={13} /> Sitter vérifié
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="sp-body">
        <div className="sp-body__inner">

          {/* Colonne gauche */}
          <div className="sp-left">

            {sitter.bio && (
              <div className="sp-section">
                <h2 className="sp-section__title">À propos</h2>
                <p className="sp-bio">{sitter.bio}</p>
              </div>
            )}

            <div className="sp-section">
              <h2 className="sp-section__title">Animaux acceptés</h2>
              <div className="sp-types">
                {sitter.acceptedAnimalTypes?.map(type => (
                  <span key={type} className="sp-type">
                    {ANIMAL_LABELS_WITH_EMOJI[type] ?? type}
                  </span>
                ))}
              </div>
            </div>

            <div className="sp-section">
              <h2 className="sp-section__title">Tarif</h2>
              <div className="sp-rate">
                <span className="sp-rate__price">{sitter.hourlyRate} €</span>
                <span className="sp-rate__per">/ nuit</span>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="sp-section">
                <h2 className="sp-section__title">
                  Avis ({reviews.length})
                  <span className="sp-reviews-avg">
                    {' '}· {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} ★
                  </span>
                </h2>
                <div className="sp-reviews">
                  {reviews.map(review => (
                    <div key={review.id} className="sp-review">
                      <div className="sp-review__header">
                        <span className="sp-review__stars">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </span>
                        {review.owner && (
                          <span className="sp-review__author">
                            {review.owner.firstName} {review.owner.lastName}
                          </span>
                        )}
                      </div>
                      {review.comment && (
                        <p className="sp-review__comment">"{review.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Colonne droite — formulaire réservation */}
          <div className="sp-right">
            <div className="sp-booking-card">

              {bookingSuccess ? (
                <div className="sp-booking-success">
                  <PawPrint size={40} />
                  <h3>Réservation envoyée !</h3>
                  <p>Le sitter va examiner votre demande et vous répondra bientôt.</p>
                  <Link to="/" className="sp-booking-success__btn">Retour à l'accueil</Link>
                </div>
              ) : !user ? (
                <div className="sp-booking-guest">
                  <PawPrint size={32} />
                  <h3>Connectez-vous pour réserver</h3>
                  <Link to="/login" className="sp-booking-login">Se connecter</Link>
                </div>
              ) : user.role === 'sitter' ? (
                <div className="sp-booking-sitter-alert">
                  <img src={dangerImg} alt="Accès refusé" className="sp-booking-sitter-alert__img" />
                  <h3>Réservation impossible</h3>
                  <p>Les sitters ne peuvent pas réserver d'autres sitters. Connectez-vous avec un compte propriétaire pour effectuer une réservation.</p>
                </div>
              ) : (
                <>
                  <h2 className="sp-booking-card__title">
                    Réserver avec {sitter.user?.firstName ?? 'ce sitter'}
                  </h2>

                  {bookingError && <p className="sp-booking-error">{bookingError}</p>}

                  <form className="sp-booking-form" onSubmit={handleBooking}>

                    <div className="sp-form-row">
                      <div className="sp-form-group">
                        <label><CalendarDays size={14} /> Date d'arrivée</label>
                        <input
                          type="date"
                          value={startDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setStartDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="sp-form-group">
                        <label><CalendarDays size={14} /> Date de départ</label>
                        <input
                          type="date"
                          value={endDate}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          onChange={e => setEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="sp-form-group">
                      <label><PawPrint size={14} /> Votre animal</label>
                      {animals.length === 0 ? (
                        <p className="sp-no-animal">
                          Vous n'avez pas encore d'animal.{' '}
                          <Link to="/home">En ajouter un</Link>
                        </p>
                      ) : (
                        <select value={animalId} onChange={e => setAnimalId(e.target.value)} required>
                          <option value="">Sélectionnez un animal</option>
                          {animals.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.species})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="sp-form-group">
                      <label><MessageSquare size={14} /> Message (facultatif)</label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Présentez votre animal, ses habitudes..."
                        rows={3}
                      />
                    </div>

                    {nights > 0 && (
                      <div className="sp-price-summary">
                        <span>{nights} nuit{nights > 1 ? 's' : ''} × {sitter.hourlyRate} €</span>
                        <span className="sp-price-total">{nights * sitter.hourlyRate} €</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="sp-booking-btn"
                      disabled={bookingLoading || animals.length === 0}
                    >
                      {bookingLoading ? 'Envoi...' : 'Confirmer la réservation'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
