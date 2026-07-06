import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TrainingPlanList from './components/TrainingPlanList';
import PhotoGallery from './components/PhotoGallery';
import PlanEditor from './components/PlanEditor';
import SyncSetup from './components/SyncSetup';
import Footer from './components/Footer';
import { useCloudSync } from './hooks/useCloudSync';
import './styles/global.css';

function App() {
  const plans = useCloudSync('hwarang-plans');
  const photos = useCloudSync('hwarang-photos');
  const [activeSection, setActiveSection] = useState('hero');
  const [editingPlan, setEditingPlan] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('hw-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const sortedPlans = Object.values(plans.data || {}).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const sortedPhotos = Object.values(photos.data || {}).sort((a, b) =>
    new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['hero', 'about', 'plans', 'gallery'];
          for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 150 && rect.bottom > 150) {
                setActiveSection(id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSavePlan = (plan) => {
    plans.update((prev) => ({ ...prev, [plan.id]: plan }));
    setShowEditor(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id) => {
    plans.update((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleAddPhoto = (photo) => {
    photos.update((prev) => ({ ...prev, [photo.id]: photo }));
  };

  const handleDeletePhoto = (id) => {
    photos.update((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleReset = () => {
    plans.resetData();
    photos.resetData();
  };

  if (!plans.ready || !photos.ready) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        color: 'var(--text-secondary)', fontSize: '18px',
      }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div>
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      <HeroSection onNavigate={handleNavigate} />
      <AboutSection />
      <TrainingPlanList
        plans={sortedPlans}
        isAdmin={plans.isAdmin}
        onEdit={(plan) => { setEditingPlan(plan); setShowEditor(true); }}
        onDelete={handleDeletePlan}
        onAdd={() => { setEditingPlan(null); setShowEditor(true); }}
      />
      <PhotoGallery
        photos={sortedPhotos}
        isAdmin={photos.isAdmin}
        onUpload={handleAddPhoto}
        onDelete={handleDeletePhoto}
      />
      <Footer />
      <SyncSetup
        isAdmin={plans.isAdmin}
        onLogin={plans.login}
        onLogout={plans.logout}
        onReset={handleReset}
      />

      <AnimatePresence>
        {showEditor && (
          <PlanEditor
            plan={editingPlan}
            onSave={handleSavePlan}
            onClose={() => { setShowEditor(false); setEditingPlan(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
