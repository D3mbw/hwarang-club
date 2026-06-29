import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncSetup({ isAdmin, onSetToken, onReset, onExport }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveToken = () => {
    if (token.trim()) {
      onSetToken(token.trim());
      setToken('');
      setOpen(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '50px', height: '50px', borderRadius: '50%',
          background: isAdmin ? 'var(--success)' : 'var(--gradient-blue)',
          color: '#fff', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)', zIndex: 100, border: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isAdmin ? 'Админ-панель' : 'Настройка'}
      >
        {isAdmin ? '🛡' : '⚙'}
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
                border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto',
              }}
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isAdmin ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>🛡</span>
                    <h3 style={{
                      fontSize: '20px', fontWeight: 700,
                      color: 'var(--success)',
                    }}>
                      Админ-панель
                    </h3>
                  </div>

                  <div style={{
                    padding: '12px', borderRadius: 'var(--radius)',
                    background: 'rgba(0,204,102,0.1)', border: '1px solid rgba(0,204,102,0.2)',
                    color: 'var(--success)', fontSize: '13px', marginBottom: '20px',
                  }}>
                    Вы авторизованы. Ваши изменения автоматически<br/>отправляются на сайт для всех устройств.
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px',
                  }}>
                    Добавляйте и удаляйте планы тренировок и фотографии
                    через обычный интерфейс сайта. Все изменения
                    автоматически сохраняются в облако и синхронизируются
                    с другими устройствами.
                  </p>

                  <motion.button
                    onClick={() => { onExport(); setOpen(false); }}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 'var(--radius)',
                      background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.2)',
                      color: 'var(--accent-light)', fontSize: '14px', fontWeight: 600,
                      marginBottom: '10px',
                    }}
                    whileHover={{ background: 'rgba(0,102,255,0.2)' }}
                  >
                    Экспорт данных в файл
                  </motion.button>

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
                </>
              ) : (
                <>
                  <h3 style={{
                    fontSize: '20px', fontWeight: 700, marginBottom: '16px',
                    background: 'var(--gradient-blue)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Настройка синхронизации
                  </h3>

                  <p style={{
                    color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.8, marginBottom: '16px',
                  }}>
                    Этот сайт работает только для чтения.<br/>
                    Чтобы добавлять планы и фото, откройте сайт
                    на устройстве администратора и настройте токен.
                  </p>

                  <div style={{
                    padding: '12px', borderRadius: 'var(--radius)',
                    background: 'var(--bg-primary)', marginBottom: '16px',
                    border: '1px solid var(--border)',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7 }}>
                      <b>Если вы — администратор:</b> вставьте GitHub-токен для управления данными.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxx"
                        style={{
                          flex: 1, padding: '10px 12px', borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)', background: 'var(--bg-secondary)',
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
                  </div>

                  <motion.button
                    onClick={() => { onExport(); setOpen(false); }}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 'var(--radius)',
                      background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.2)',
                      color: 'var(--accent-light)', fontSize: '13px', fontWeight: 600,
                    }}
                    whileHover={{ background: 'rgba(0,102,255,0.2)' }}
                  >
                    Экспорт данных в файл
                  </motion.button>
                </>
              )}
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
                Удалить все планы и фото на всех устройствах?
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
