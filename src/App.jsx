import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TrainingPlanList from './components/TrainingPlanList';
import PhotoGallery from './components/PhotoGallery';
import PlanEditor from './components/PlanEditor';
import Footer from './components/Footer';
import './styles/global.css';

const STORAGE_KEY_PLANS = 'hwarang-plans-v2';
const STORAGE_KEY_PHOTOS = 'hwarang-photos-v2';

function loadData(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      const obj = {};
      parsed.forEach((item) => {
        if (item && item.id) obj[item.id] = item;
      });
      return obj;
    }
    if (typeof parsed === 'object' && parsed !== null) return parsed;
    return {};
  } catch {
    return {};
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Save error:', e);
  }
}

function App() {
  const [plansObj, setPlansObj] = useState(() => loadData(STORAGE_KEY_PLANS));
  const [photosObj, setPhotosObj] = useState(() => loadData(STORAGE_KEY_PHOTOS));
  const [activeSection, setActiveSection] = useState('hero');
  const [editingPlan, setEditingPlan] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => { saveData(STORAGE_KEY_PLANS, plansObj); }, [plansObj]);
  useEffect(() => { saveData(STORAGE_KEY_PHOTOS, photosObj); }, [photosObj]);

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
    setPlansObj((prev) => ({ ...prev, [plan.id]: plan }));
    setShowEditor(false);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowEditor(true);
  };

  const handleDeletePlan = (id) => {
    setPlansObj((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAddPhoto = (photo) => {
    setPhotosObj((prev) => ({ ...prev, [photo.id]: photo }));
  };

  const handleDeletePhoto = (id) => {
    setPhotosObj((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleExportData = () => {
    const data = { plans: plansObj, photos: photosObj };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hwarang-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.plans) setPlansObj(data.plans);
        if (data.photos) setPhotosObj(data.photos);
        alert('Данные импортированы!');
      } catch {
        alert('Ошибка при импорте файла');
      }
    };
    reader.readAsText(file);
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

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        padding: '20px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={handleExportData}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--accent)',
            background: 'transparent',
            color: 'var(--accent-light)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Экспорт данных
        </button>
        <label style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          Импорт данных
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </label>
      </div>

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
