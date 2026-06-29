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
  const [plansMap, setPlansMap, plansReady, setPlansToken, plansHasToken, resetPlans] = useCloudSync('hwarang-plans');
  const [photosMap, setPhotosMap, photosReady, setPhotosToken, photosHasToken, resetPhotos] = useCloudSync('hwarang-photos');
  const [activeSection, setActiveSection] = useState('hero');
  const [editingPlan, setEditingPlan] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const plans = Object.values(plansMap || {}).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const photos = Object.values(photosMap || {}).sort((a, b) =>
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
    setPlansMap((prev) => ({ ...prev, [plan.id]: plan }));
    setShowEditor(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id) => {
    setPlansMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleAddPhoto = (photo) => {
    setPhotosMap((prev) => ({ ...prev, [photo.id]: photo }));
  };

  const handleDeletePhoto = (id) => {
    setPhotosMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSetToken = (token) => {
    setPlansToken(token);
    setPhotosToken(token);
  };

  const handleReset = () => {
    resetPlans();
    resetPhotos();
  };

  if (!plansReady || !photosReady) {
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
        plans={plans}
        onEdit={(plan) => { setEditingPlan(plan); setShowEditor(true); }}
        onDelete={handleDeletePlan}
        onAdd={() => { setEditingPlan(null); setShowEditor(true); }}
      />
      <PhotoGallery
        photos={photos}
        onUpload={handleAddPhoto}
        onDelete={handleDeletePhoto}
      />
      <Footer />

      <SyncSetup onSetToken={handleSetToken} hasToken={plansHasToken} onReset={handleReset} />

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
