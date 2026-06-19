import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TrainingPlanList from './components/TrainingPlanList';
import PhotoGallery from './components/PhotoGallery';
import PlanEditor from './components/PlanEditor';
import Footer from './components/Footer';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles/global.css';

function App() {
  const [plans, setPlans] = useLocalStorage('hwarang-plans', []);
  const [photos, setPhotos] = useLocalStorage('hwarang-photos', []);
  const [activeSection, setActiveSection] = useState('hero');
  const [editingPlan, setEditingPlan] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

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
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSavePlan = (plan) => {
    setPlans((prev) => {
      const existing = prev.find((p) => p.id === plan.id);
      if (existing) {
        return prev.map((p) => (p.id === plan.id ? plan : p));
      }
      return [plan, ...prev];
    });
    setShowEditor(false);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowEditor(true);
  };

  const handleDeletePlan = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPhoto = (photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const handleDeletePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

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
