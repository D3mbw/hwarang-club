import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoUploader from './PhotoUploader';

const sectionStyle = {
  padding: '100px 40px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '60px',
};

const subtitleStyle = {
  fontSize: '14px',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontWeight: 600,
  marginBottom: '16px',
};

const titleStyle = {
  fontSize: 'clamp(32px, 5vw, 48px)',
  fontWeight: 800,
  marginBottom: '16px',
};

const descStyle = {
  fontSize: '16px',
  color: 'var(--text-secondary)',
  maxWidth: '500px',
  margin: '0 auto 40px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px',
  marginTop: '30px',
};

const photoCardStyle = {
  position: 'relative',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
  aspectRatio: '4/3',
  cursor: 'pointer',
};

const photoImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s',
};

const photoOverlayStyle = (hovered) => ({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
  opacity: hovered ? 1 : 0,
  transition: 'opacity 0.3s',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '16px',
});

const photoNameStyle = {
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
};

const deletePhotoBtnStyle = (hovered) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'rgba(255, 68, 68, 0.8)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  opacity: hovered ? 1 : 0,
  transition: 'opacity 0.3s',
});

const lightboxStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
  cursor: 'pointer',
};

const lightboxImgStyle = {
  maxWidth: '90vw',
  maxHeight: '90vh',
  objectFit: 'contain',
  borderRadius: 'var(--radius)',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(10px)',
};

export default function PhotoGallery({ photos, onUpload, onDelete }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="gallery" style={sectionStyle}>
      <motion.div
        style={headerStyle}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={subtitleStyle}>Галерея</div>
        <h2 style={titleStyle}>Фотографии клуба</h2>
        <p style={descStyle}>
          Моменты тренировок, соревнований и жизни клуба
        </p>
      </motion.div>

      <PhotoUploader onUpload={onUpload} />

      {photos.length > 0 && (
        <div style={gridStyle}>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              style={photoCardStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredId(photo.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={photo.url}
                alt={photo.name}
                style={{
                  ...photoImgStyle,
                  transform: hoveredId === photo.id ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => setSelectedPhoto(photo)}
              />
              <div style={photoOverlayStyle(hoveredId === photo.id)}>
                <span style={photoNameStyle}>{photo.name}</span>
              </div>
              <motion.button
                style={deletePhotoBtnStyle(hoveredId === photo.id)}
                whileHover={{ background: 'rgba(255, 68, 68, 1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo.id);
                }}
              >
                ×
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            style={lightboxStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              style={lightboxImgStyle}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <motion.button
              style={closeBtnStyle}
              whileHover={{ background: 'rgba(255,255,255,0.2)' }}
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
