import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncSetup({ onSetToken, hasToken, onReset }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = () => {
    if (input.trim()) {
      onSetToken(input.trim());
      setOpen(false);
      setInput('');
    }
  };

  const handleReset = () => {
    onReset();
    setConfirmReset(false);
    setOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: hasToken ? 'var(--success)' : 'var(--gradient-blue)',
          color: '#fff',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
          zIndex: 100,
          border: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {hasToken ? '☁' : '⚙'}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                padding: '32px', maxWidth: '480px', width: '100%',
                border: '1px solid var(--border)',
              }}
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                fontSize: '22px', fontWeight: 700, marginBottom: '16px',
                background: 'var(--gradient-blue)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Облачная синхронизация
              </h3>

              <p style={{
                color: 'var(--text-secondary)', fontSize: '14px',
                lineHeight: 1.7, marginBottom: '16px',
              }}>
                Данные хранятся в <b>GitHub Gist</b> (бесплатно). Чтение — автоматическое,
                запись — через ваш GitHub-токен.
              </p>

              <p style={{
                color: 'var(--text-secondary)', fontSize: '13px',
                lineHeight: 1.8, marginBottom: '16px',
                background: 'var(--bg-primary)', padding: '12px 14px',
                borderRadius: 'var(--radius)',
              }}>
                <b>Как получить токен:</b><br/>
                1. github.com → Settings → Developer settings<br/>
                2. Personal access tokens → Tokens (classic)<br/>
                3. Generate new token → галочка <b>gist</b> → Generate<br/>
                4. Скопируйте токен и вставьте ниже
              </p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  style={{
                    flex: 1, padding: '12px 14px', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)', background: 'var(--bg-primary)',
                    color: 'var(--text-primary)', fontSize: '14px',
                  }}
                />
                <motion.button
                  onClick={handleSave}
                  style={{
                    padding: '12px 20px', borderRadius: 'var(--radius)',
                    background: 'var(--gradient-blue)', color: '#fff',
                    fontSize: '14px', fontWeight: 600, border: 'none',
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  OK
                </motion.button>
              </div>

              {hasToken && (
                <motion.button
                  onClick={() => { onSetToken(''); setOpen(false); }}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 'var(--radius)',
                    background: 'rgba(255,68,68,0.1)', color: 'var(--danger)',
                    fontSize: '13px', fontWeight: 600,
                    border: '1px solid rgba(255,68,68,0.2)',
                  }}
                  whileHover={{ background: 'rgba(255,68,68,0.2)' }}
                >
                  Отключить синхронизацию
                </motion.button>
              )}

              <motion.button
                onClick={() => setConfirmReset(true)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 'var(--radius)',
                  background: 'rgba(255,165,0,0.1)', color: '#ffa500',
                  fontSize: '13px', fontWeight: 600, marginTop: '10px',
                  border: '1px solid rgba(255,165,0,0.2)',
                }}
                whileHover={{ background: 'rgba(255,165,0,0.2)' }}
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
                  whileHover={{ borderColor: '#fff', color: '#fff' }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  style={{
                    padding: '10px 24px', borderRadius: 'var(--radius)',
                    background: 'var(--danger)', color: '#fff',
                    fontSize: '14px', fontWeight: 600, border: 'none',
                  }}
                  whileHover={{ opacity: 0.9 }}
                >
                  Удалить всё
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
