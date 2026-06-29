import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function compress(data) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(data)))); }
  catch { return ''; }
}

function decompress(str) {
  try { return JSON.parse(decodeURIComponent(escape(atob(str)))); }
  catch { return null; }
}

export default function SyncSetup({ onImport, onReset }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('copy');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleCopy = async () => {
    const plans = JSON.parse(localStorage.getItem('hwarang-plans') || '{}');
    const photos = JSON.parse(localStorage.getItem('hwarang-photos') || '{}');
    const code = compress({ plans, photos });
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const t = document.createElement('textarea');
      t.value = code;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = () => {
    const data = decompress(importText.trim());
    if (data && data.plans) {
      onImport(data);
      setImportText('');
      setOpen(false);
    } else {
      alert('Неверный код. Убедитесь, что скопировали весь код.');
    }
  };

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
        ☰
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
                padding: '28px', maxWidth: '440px', width: '100%',
                border: '1px solid var(--border)',
              }}
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                fontSize: '20px', fontWeight: 700, marginBottom: '20px',
                background: 'var(--gradient-blue)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Синхронизация
              </h3>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <motion.button
                  onClick={() => setTab('copy')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius)',
                    background: tab === 'copy' ? 'var(--accent)' : 'transparent',
                    color: '#fff', fontSize: '13px', fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Экспорт
                </motion.button>
                <motion.button
                  onClick={() => setTab('paste')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius)',
                    background: tab === 'paste' ? 'var(--accent)' : 'transparent',
                    color: '#fff', fontSize: '13px', fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Импорт
                </motion.button>
              </div>

              {tab === 'copy' && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
                    Нажмите кнопку, скопируйте код и откройте его на другом устройстве через вкладку «Импорт».
                  </p>
                  <motion.button
                    onClick={handleCopy}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 'var(--radius)',
                      background: copied ? 'var(--success)' : 'var(--gradient-blue)',
                      color: '#fff', fontSize: '15px', fontWeight: 600, border: 'none',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {copied ? '✓ Скопировано!' : 'Копировать код'}
                  </motion.button>
                </div>
              )}

              {tab === 'paste' && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px', lineHeight: 1.6 }}>
                    Вставьте скопированный код:
                  </p>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Вставьте код сюда..."
                    style={{
                      width: '100%', height: '100px', padding: '12px',
                      borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', color: 'var(--text-primary)',
                      fontSize: '13px', resize: 'none', fontFamily: 'monospace', marginBottom: '12px',
                    }}
                  />
                  <motion.button
                    onClick={handleImport}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 'var(--radius)',
                      background: 'var(--gradient-blue)', color: '#fff',
                      fontSize: '15px', fontWeight: 600, border: 'none',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Импортировать
                  </motion.button>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '16px' }}>
                <motion.button
                  onClick={() => setConfirmReset(true)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 'var(--radius)',
                    background: 'rgba(255,68,68,0.1)', color: 'var(--danger)',
                    fontSize: '13px', fontWeight: 600,
                    border: '1px solid rgba(255,68,68,0.2)',
                  }}
                  whileHover={{ background: 'rgba(255,68,68,0.2)' }}
                >
                  Сбросить все данные
                </motion.button>
              </div>
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
                  onClick={() => { onReset(); setConfirmReset(false); setOpen(false); }}
                  style={{
                    padding: '10px 24px', borderRadius: 'var(--radius)',
                    background: 'var(--danger)', color: '#fff',
                    fontSize: '14px', fontWeight: 600, border: 'none',
                  }}
                  whileHover={{ opacity: 0.9 }}
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
