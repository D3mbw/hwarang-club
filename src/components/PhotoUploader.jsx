import { useRef } from 'react';
import { motion } from 'framer-motion';

const dropzoneStyle = {
  border: '2px dashed var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '40px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s',
  background: 'var(--bg-secondary)',
};

const iconStyle = {
  fontSize: '48px',
  marginBottom: '16px',
  opacity: 0.5,
};

const textStyle = {
  color: 'var(--text-secondary)',
  fontSize: '15px',
  marginBottom: '8px',
};

const hintStyle = {
  color: 'var(--text-secondary)',
  fontSize: '12px',
  opacity: 0.6,
};

export default function PhotoUploader({ onUpload }) {
  const fileInputRef = useRef(null);

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

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
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
  };

  return (
    <motion.div
      style={dropzoneStyle}
      whileHover={{
        borderColor: 'var(--accent)',
        background: 'rgba(0, 102, 255, 0.05)',
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
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
      <div style={iconStyle}>📷</div>
      <p style={textStyle}>Нажмите или перетащите фотографии сюда</p>
      <p style={hintStyle}>PNG, JPG, WEBP — до 5MB</p>
    </motion.div>
  );
}
