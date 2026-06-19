import { motion } from 'framer-motion';

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  padding: '0 40px',
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(10, 10, 10, 0.85)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border)',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  background: 'var(--gradient-blue)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const logoIconStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  objectFit: 'cover',
};

const navStyle = {
  display: 'flex',
  gap: '32px',
  listStyle: 'none',
};

const navLinkStyle = {
  color: 'var(--text-secondary)',
  fontSize: '15px',
  fontWeight: 500,
  transition: 'color 0.3s',
  cursor: 'pointer',
  position: 'relative',
};

export default function Header({ activeSection, onNavigate }) {
  const sections = [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'О клубе' },
    { id: 'plans', label: 'Планы' },
    { id: 'gallery', label: 'Галерея' },
  ];

  return (
    <motion.header
      style={headerStyle}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={logoStyle}>
        <img src="/hwarang-club/logo.jpg" alt="Хваран" style={logoIconStyle} />
        ХВАРАН
      </div>
      <nav>
        <ul style={navStyle}>
          {sections.map((s) => (
            <motion.li
              key={s.id}
              style={{
                ...navLinkStyle,
                color: activeSection === s.id ? 'var(--accent-light)' : 'var(--text-secondary)',
              }}
              whileHover={{ color: '#ffffff' }}
              onClick={() => onNavigate(s.id)}
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
    </motion.header>
  );
}
