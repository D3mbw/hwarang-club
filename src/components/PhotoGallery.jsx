import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoUploader from './PhotoUploader';

export default function PhotoGallery({ photos, onUpload, onDelete }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="gallery"
      style={{
        padding: isMobile ? '60px 16px' : '100px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <motion.div
        style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          fontSize: '14px',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontWeight: 600,
          marginBottom: '16px',
        }}>
          Галерея
        </div>
        <h2 style={{
          fontSize: isMobile ? '28px' : 'clamp(32px, 5vw, 48px)',
          fontWeight: 800,
          marginBottom: '16px',
        }}>
          Фотографии клуба
        </h2>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto 30px',
        }}>
          Моменты тренировок, соревнований и жизни клуба
        </p>
      </motion.div>

      {onUpload && <PhotoUploader onUpload={onUpload} />}

      {photos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: isMobile ? '12px' : '20px',
          marginTop: '30px',
        }}>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                aspectRatio: '4/3',
                cursor: 'pointer',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredId(photo.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                if (isMobile) setSelectedPhoto(photo);
              }}
            >
              <img
                src={photo.url}
                alt={photo.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s',
                  transform: hoveredId === photo.id ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
                opacity: hoveredId === photo.id || isMobile ? 1 : 0,
                transition: 'opacity 0.3s',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '12px',
              }}>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                  {photo.name}
                </span>
              </div>
              {onDelete && (
              <motion.button
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255, 68, 68, 0.85)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  opacity: hoveredId === photo.id ? 1 : 0,
                  transition: 'opacity 0.3s',
                  border: 'none',
                }}
                whileHover={{ background: 'rgba(255, 68, 68, 1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo.id);
                }}
              >
                ×
              </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
              cursor: 'pointer',
              padding: '20px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              style={{
                maxWidth: '95vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius)',
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <motion.button
              style={{
                position: 'absolute',
                top: isMobile ? '10px' : '20px',
                right: isMobile ? '10px' : '20px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: 'none',
              }}
              whileHover={{ background: 'rgba(255,255,255,0.25)' }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
