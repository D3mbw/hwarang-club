import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ activeSection, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'О клубе' },
    { id: 'plans', label: 'Планы' },
    { id: 'gallery', label: 'Галерея' },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isMobile ? '0 16px' : '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 800,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          background: 'var(--gradient-blue)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          <img
            src="/logo.jpg"
            alt="Хваран"
            style={{
              width: isMobile ? '36px' : '44px',
              height: isMobile ? '36px' : '44px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          ХВАРАН
        </div>

        {!isMobile && (
          <nav>
            <ul style={{ display: 'flex', gap: '28px', listStyle: 'none' }}>
              {sections.map((s) => (
                <motion.li
                  key={s.id}
                  style={{
                    color: activeSection === s.id ? 'var(--accent-light)' : 'var(--text-secondary)',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.3s',
                  }}
                  whileHover={{ color: 'var(--text-primary)' }}
                  onClick={() => handleNav(s.id)}
                >
                  {s.label}
                  {activeSection === s.id && (
                    <motion.div
                      layoutId="navIndicator"
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--accent)',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>
        )}

        {isMobile && (
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 1001,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{ width: '24px', height: '2px', background: '#fff', borderRadius: '1px' }}
            />
            <motion.div
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{ width: '24px', height: '2px', background: '#fff', borderRadius: '1px' }}
            />
            <motion.div
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{ width: '24px', height: '2px', background: '#fff', borderRadius: '1px' }}
            />
          </motion.button>
        )}
      </motion.header>

      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: '64px',
              right: 0,
              bottom: 0,
              width: '75%',
              maxWidth: '280px',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border)',
              zIndex: 999,
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {sections.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleNav(s.id)}
                style={{
                  background: activeSection === s.id ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                  border: 'none',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  color: activeSection === s.id ? 'var(--accent-light)' : 'var(--text-secondary)',
                  fontSize: '16px',
                  fontWeight: 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {menuOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            top: '64px',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
        />
      )}
    </>
  );
}
