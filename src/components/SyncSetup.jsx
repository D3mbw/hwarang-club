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

export default function SyncSetup({ onSetToken, hasToken, onReset }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('setup');
  const [token, setToken] = useState('');
  const [importCode, setImportCode] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveToken = () => {
    if (token.trim()) {
      onSetToken(token.trim());
      setToken('');
      setOpen(false);
    }
  };

  const handleCopyCode = async () => {
    const plans = JSON.parse(localStorage.getItem('hw-local-hwarang-plans') || '{}');
    const photos = JSON.parse(localStorage.getItem('hw-local-hwarang-photos') || '{}');
    const code = compress({ 'hwarang-plans': plans, 'hwarang-photos': photos });
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const t = document.createElement('textarea');
      t.value = code;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportCode = () => {
    const data = decompress(importCode.trim());
    if (data) {
      if (data['hwarang-plans'] || data['hwarang-photos']) {
        const plans = data['hwarang-plans'] || {};
        const photos = data['hwarang-photos'] || {};
        localStorage.setItem('hw-local-hwarang-plans', JSON.stringify(plans));
        localStorage.setItem('hw-local-hwarang-photos', JSON.stringify(photos));
        window.location.reload();
      }
    } else {
      alert('Неверный код');
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '50px', height: '50px', borderRadius: '50%',
          background: hasToken ? 'var(--success)' : 'var(--gradient-blue)',
          color: '#fff', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)', zIndex: 100, border: 'none',
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                padding: '28px', maxWidth: '480px', width: '100%',
                border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto',
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

              {hasToken && (
                <div style={{
                  padding: '12px', borderRadius: 'var(--radius)',
                  background: 'rgba(0,204,102,0.1)', border: '1px solid rgba(0,204,102,0.2)',
                  color: 'var(--success)', fontSize: '13px', marginBottom: '16px',
                }}>
                  Автосинхронизация включена
                </div>
              )}

              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { id: 'setup', label: 'Настройка' },
                  { id: 'copy', label: 'Копировать' },
                  { id: 'paste', label: 'Вставить' },
                ].map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      flex: 1, minWidth: '80px', padding: '8px', borderRadius: '8px',
                      background: tab === t.id ? 'var(--accent)' : 'transparent',
                      color: '#fff', fontSize: '12px', fontWeight: 600,
                      border: '1px solid var(--border)',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t.label}
                  </motion.button>
                ))}
              </div>

              {tab === 'setup' && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
                    Для автосинхронизации нужен GitHub-токен (настройка один раз):
                  </p>
                  <ol style={{
                    color: 'var(--text-secondary)', fontSize: '13px',
                    lineHeight: 2, paddingLeft: '18px', marginBottom: '16px',
                  }}>
                    <li>github.com → Settings → Developer settings</li>
                    <li>Personal access tokens → Tokens (classic)</li>
                    <li>Generate new token → галочка <b>repo</b></li>
                    <li>Скопируйте токен сюда ↓</li>
                  </ol>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                      style={{
                        flex: 1, padding: '10px 12px', borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)', background: 'var(--bg-primary)',
                        color: 'var(--text-primary)', fontSize: '13px',
                      }}
                    />
                    <motion.button
                      onClick={handleSaveToken}
                      style={{
                        padding: '10px 16px', borderRadius: 'var(--radius)',
                        background: 'var(--gradient-blue)', color: '#fff',
                        fontSize: '13px', fontWeight: 600, border: 'none',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      OK
                    </motion.button>
                  </div>
                  {hasToken && (
                    <motion.button
                      onClick={() => { onSetToken(''); setOpen(false); }}
                      style={{
                        width: '100%', padding: '8px', borderRadius: '8px',
                        background: 'rgba(255,68,68,0.1)', color: 'var(--danger)',
                        fontSize: '12px', fontWeight: 600,
                        border: '1px solid rgba(255,68,68,0.2)',
                      }}
                    >
                      Отключить автосинхронизацию
                    </motion.button>
                  )}
                </div>
              )}

              {tab === 'copy' && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7, marginBottom: '12px' }}>
                    Нажмите кнопку, скопируйте код и вставьте на другом устройстве.
                  </p>
                  <motion.button
                    onClick={handleCopyCode}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 'var(--radius)',
                      background: copied ? 'var(--success)' : 'var(--gradient-blue)',
                      color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {copied ? '✓ Скопировано!' : 'Копировать код'}
                  </motion.button>
                </div>
              )}

              {tab === 'paste' && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px', lineHeight: 1.6 }}>
                    Вставьте код с другого устройства:
                  </p>
                  <textarea
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    placeholder="Вставьте код..."
                    style={{
                      width: '100%', height: '80px', padding: '10px',
                      borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', color: 'var(--text-primary)',
                      fontSize: '12px', resize: 'none', fontFamily: 'monospace', marginBottom: '10px',
                    }}
                  />
                  <motion.button
                    onClick={handleImportCode}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 'var(--radius)',
                      background: 'var(--gradient-blue)', color: '#fff',
                      fontSize: '14px', fontWeight: 600, border: 'none',
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
