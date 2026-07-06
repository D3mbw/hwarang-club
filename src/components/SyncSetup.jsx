import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncSetup({ onReset }) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'var(--gradient-blue)', color: '#fff', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)', zIndex: 100, border: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ⚙
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 2000, padding: '20px',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                padding: '28px', maxWidth: '400px', width: '100%',
                border: '1px solid var(--border)',
              }}
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                fontSize: '20px', fontWeight: 700, marginBottom: '16px',
                background: 'var(--gradient-blue)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Настройки
              </h3>

              <p style={{
                color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7,
                marginBottom: '20px',
              }}>
                Данные автоматически синхронизируются между всеми
                устройствами через облако. Настройка не требуется.
              </p>

              <motion.button
                onClick={() => setConfirmReset(true)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 'var(--radius)',
                  background: 'rgba(255,68,68,0.1)', color: 'var(--danger)',
                  fontSize: '14px', fontWeight: 600,
                  border: '1px solid rgba(255,68,68,0.2)',
                }}
                whileHover={{ background: 'rgba(255,68,68,0.2)' }}
              >
                Сбросить все данные
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 3000, padding: '20px',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                padding: '28px', maxWidth: '360px', width: '100%',
                border: '1px solid var(--border)', textAlign: 'center',
              }}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            >
              <p style={{ fontSize: '16px', marginBottom: '20px', color: '#fff' }}>
                Удалить все планы и фото?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <motion.button
                  onClick={() => setConfirmReset(false)}
                  style={{
                    padding: '10px 24px', borderRadius: 'var(--radius)',
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600,
                  }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  onClick={() => { onReset(); setConfirmReset(false); setOpen(false); }}
                  style={{
                    padding: '10px 24px', borderRadius: 'var(--radius)',
                    background: 'var(--danger)', color: '#fff',
                    fontSize: '14px', fontWeight: 600, border: 'none',
                  }}
                >
                  Удалить
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
