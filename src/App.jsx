import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TrainingPlanList from './components/TrainingPlanList';
import PhotoGallery from './components/PhotoGallery';
import PlanEditor from './components/PlanEditor';
import Footer from './components/Footer';
import { useCloudStorage } from './hooks/useCloudStorage';
import './styles/global.css';

function App() {
  const [plansObj, setPlansObj, plansLoading] = useCloudStorage('hwarang-plans', {});
  const [photosObj, setPhotosObj, photosLoading] = useCloudStorage('hwarang-photos', {});
  const [activeSection, setActiveSection] = useState('hero');
  const [editingPlan, setEditingPlan] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const plans = Object.values(plansObj || {}).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const photos = Object.values(photosObj || {}).sort((a, b) =>
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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSavePlan = (plan) => {
    const updated = { ...plansObj, [plan.id]: plan };
    setPlansObj(updated);
    setShowEditor(false);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowEditor(true);
  };

  const handleDeletePlan = (id) => {
    const updated = { ...plansObj };
    delete updated[id];
    setPlansObj(updated);
  };

  const handleAddPhoto = (photo) => {
    const updated = { ...photosObj, [photo.id]: photo };
    setPhotosObj(updated);
  };

  const handleDeletePhoto = (id) => {
    const updated = { ...photosObj };
    delete updated[id];
    setPhotosObj(updated);
  };

  if (plansLoading || photosLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontSize: '18px',
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
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
        onAdd={() => {
          setEditingPlan(null);
          setShowEditor(true);
        }}
      />
      <PhotoGallery
        photos={photos}
        onUpload={handleAddPhoto}
        onDelete={handleDeletePhoto}
      />
      <Footer />

      <AnimatePresence>
        {showEditor && (
          <PlanEditor
            plan={editingPlan}
            onSave={handleSavePlan}
            onClose={() => {
              setShowEditor(false);
              setEditingPlan(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
