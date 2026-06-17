import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import type { Animal, SitterProfile, BookingWithRelations } from '../../types/index';
import OwnerDashboard from './OwnerDashboard';
import SitterDashboard from './SitterDashboard';
import helloImg from '../../assets/danger/hello.png';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [profile, setProfile] = useState<SitterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!user) return;
    if (user.role === 'owner') {
      Promise.all([
        api.get<Animal[]>('/animals'),
        api.get<BookingWithRelations[]>('/bookings/mine'),
      ])
        .then(([animalsRes, bookingsRes]) => {
          setAnimals(animalsRes.data);
          setBookings(bookingsRes.data);
        })
        .catch(() => setLoadError('Erreur lors du chargement.'))
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        api.get<SitterProfile>('/sitter-profile/me'),
        api.get<BookingWithRelations[]>('/bookings/incoming'),
      ])
        .then(([profileRes, bookingsRes]) => {
          setProfile(profileRes.data);
          setBookings(bookingsRes.data);
        })
        .catch(() => setLoadError('Erreur lors du chargement.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="homepage">
      <Navbar />

      <header className="homepage__header">
        <div className="homepage__header-inner">
          <div className="homepage__header-text">
            <p className="homepage__hi">Bonjour,</p>
            <h1 className="homepage__greeting">{user.firstName || 'vous'}.</h1>
            <div className="homepage__meta-bar">
              <span className="homepage__role-tag">
                {user.role === 'owner' ? 'Propriétaire' : 'Pet-sitter'}
              </span>
              <div className="homepage__metrics">
                {user.role === 'owner' && (
                  <div className="homepage__metric">
                    <span className="homepage__metric-num">{animals.length}</span>
                    <span className="homepage__metric-label">animal{animals.length !== 1 ? 'aux' : ''}</span>
                  </div>
                )}
                <div className="homepage__metric">
                  <span className="homepage__metric-num">{pendingCount}</span>
                  <span className="homepage__metric-label">en attente</span>
                </div>
                <div className="homepage__metric">
                  <span className="homepage__metric-num">{confirmedCount}</span>
                  <span className="homepage__metric-label">confirmée{confirmedCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="homepage__header-deco">
            <img src={helloImg} alt="" className="homepage__deco-img" />
          </div>
        </div>
      </header>

      <main className="homepage__body">
        {loading ? (
          <div className="homepage__loading">Chargement…</div>
        ) : loadError ? (
          <div className="homepage__loading homepage__loading--error">{loadError}</div>
        ) : user.role === 'owner' ? (
          <OwnerDashboard
            animals={animals}
            bookings={bookings}
            setAnimals={setAnimals}
            setBookings={setBookings}
          />
        ) : (
          <SitterDashboard
            profile={profile}
            bookings={bookings}
            setProfile={setProfile}
            setBookings={setBookings}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
