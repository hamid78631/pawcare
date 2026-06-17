import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, PawPrint, Search, Star } from 'lucide-react';
import type { SitterProfile } from '../../types/index';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { sitterService } from '../../api/sitterService';
import { ANIMAL_LABELS_WITH_EMOJI } from '../../utils/constants';
import { getInitialsFromProfile } from '../../utils/formatters';
import './SittersPage.css';

export default function SittersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sitters, setSitters] = useState<SitterProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityInput, setCityInput] = useState(searchParams.get('city') ?? '');
  const [animalType, setAnimalType] = useState(searchParams.get('animalType') ?? '');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const city = searchParams.get('city') ?? '';

  useEffect(() => { setPage(1); }, [city, animalType]);

  useEffect(() => {
    const fetchSitters = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await sitterService.search({
          ...(city && { city }),
          ...(animalType && { animalType }),
        });
        setSitters(data);
      } catch {
        setError('Impossible de charger les sitters.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSitters();
  }, [city, animalType]);


  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (cityInput.trim()) params.city = cityInput.trim();
    if (animalType) params.animalType = animalType;
    setSearchParams(params);
  };

  return (
    <div className="sitters-page">
      <Navbar />

      {/* En-tête */}
      <div className="sitters-header">
        <div className="sitters-header__inner">
          <p className="sitters-header__label">
            <PawPrint size={15} />
            Sitters disponibles
          </p>
          <h1 className="sitters-header__title">
            {city ? <>Sitters à <span>{city}</span></> : 'Tous nos sitters'}
          </h1>
          {!isLoading && (
            <p className="sitters-header__count">
              {sitters.length} sitter{sitters.length !== 1 ? 's' : ''} trouvé{sitters.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="sitters-filters">
        <div className="sitters-filters__inner">
          <div className="sitters-filter__group">
            <MapPin size={16} className="sitters-filter__icon" />
            <input
              type="text"
              placeholder="Ville..."
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="sitters-filter__input"
            />
          </div>
          <div className="sitters-filter__group">
            <PawPrint size={16} className="sitters-filter__icon" />
            <select
              value={animalType}
              onChange={e => setAnimalType(e.target.value)}
              className="sitters-filter__select"
            >
              <option value="">Tous les animaux</option>
              <option value="dog">🐕 Chien</option>
              <option value="cat">🐈 Chat</option>
              <option value="other">🐾 Autre</option>
            </select>
          </div>
          <button className="sitters-filter__btn" onClick={handleSearch}>
            <Search size={16} />
            Rechercher
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="sitters-content">

        {isLoading && (
          <div className="sitters-loading">
            <PawPrint size={40} className="sitters-loading__icon" />
            <p>Recherche en cours...</p>
          </div>
        )}

        {error && <p className="sitters-error">{error}</p>}

        {!isLoading && !error && sitters.length === 0 && (
          <div className="sitters-empty">
            <PawPrint size={48} />
            <h2>Aucun sitter trouvé</h2>
            <p>Essayez une autre ville ou retirez les filtres.</p>
            <Link to="/" className="sitters-empty__btn">Retour à l'accueil</Link>
          </div>
        )}

        {!isLoading && sitters.length > 0 && (
          <div className="sitters-grid">
            {sitters.slice(0, page * ITEMS_PER_PAGE).map(sitter => (
              <div key={sitter.id} className="sitter-card">

                {/* Avatar */}
                <div className="sitter-card__avatar">
                  {getInitialsFromProfile(sitter)}
                </div>

                {/* Nom */}
                <h3 className="sitter-card__name">
                  {sitter.user
                    ? `${sitter.user.firstName} ${sitter.user.lastName}`
                    : 'Sitter PawCare'}
                </h3>

                {/* Ville */}
                {sitter.city && (
                  <p className="sitter-card__city">
                    <MapPin size={13} />
                    {sitter.city}
                  </p>
                )}

                {/* Bio */}
                {sitter.bio && (
                  <p className="sitter-card__bio">
                    {sitter.bio.length > 100 ? sitter.bio.slice(0, 100) + '…' : sitter.bio}
                  </p>
                )}

                {/* Types d'animaux */}
                {sitter.acceptedAnimalTypes && sitter.acceptedAnimalTypes.length > 0 && (
                  <div className="sitter-card__types">
                    {sitter.acceptedAnimalTypes.map(type => (
                      <span key={type} className="sitter-card__type">
                        {ANIMAL_LABELS_WITH_EMOJI[type] ?? type}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pied de carte */}
                <div className="sitter-card__footer">
                  <div className="sitter-card__rate">
                    <Star size={14} />
                    <span className="sitter-card__price">{sitter.hourlyRate} €</span>
                    <span className="sitter-card__per">/nuit</span>
                  </div>
                  <Link to={`/sitters/${sitter.id}`} className="sitter-card__btn">
                    Voir le profil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && sitters.length > page * ITEMS_PER_PAGE && (
          <div className="sitters-loadmore">
            <button className="sitters-loadmore__btn" onClick={() => setPage(p => p + 1)}>
              Voir plus
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
