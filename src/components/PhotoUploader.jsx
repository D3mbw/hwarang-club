import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function PhotoUploader({ onUpload }) {
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpload({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: event.target.result,
            name: file.name,
            uploadedAt: new Date().toISOString(),
          });
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  return (
    <motion.div
      style={{
        border: '2px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: isMobile ? '28px 16px' : '40px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        background: 'var(--bg-secondary)',
      }}
      whileHover={{
        borderColor: 'var(--accent)',
        background: 'rgba(0, 102, 255, 0.05)',
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: '12px', opacity: 0.5 }}>📷</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '14px' : '15px', marginBottom: '8px' }}>
        {isMobile ? 'Нажмите чтобы загрузить фото' : 'Нажмите или перетащите фотографии сюда'}
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '12px', opacity: 0.6 }}>
        PNG, JPG, WEBP — до 5MB
      </p>
    </motion.div>
  );
}
