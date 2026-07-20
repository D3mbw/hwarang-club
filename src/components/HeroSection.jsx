import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const particles = [
  { x: 15, y: 20, delay: 0 },
  { x: 80, y: 30, delay: 0.5 },
  { x: 25, y: 70, delay: 1 },
  { x: 70, y: 60, delay: 1.5 },
  { x: 50, y: 15, delay: 2 },
  { x: 35, y: 85, delay: 2.5 },
  { x: 90, y: 45, delay: 0.3 },
  { x: 10, y: 55, delay: 0.8 },
];

export default function HeroSection({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: isMobile ? '80px 20px 60px' : '100px 20px',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(0, 68, 204, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(0, 40, 120, 0.2) 0%, transparent 50%)
        `,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 102, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 102, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 0,
      }} />

      {particles.map((p) => (
        <motion.div
          key={p.x}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--accent)',
            opacity: 0.3,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        style={{ position: 'relative', zIndex: 1, maxWidth: '900px', width: '100%' }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.img
          src="/logo.jpg"
          alt="Хваран клуб"
          style={{
            width: isMobile ? '160px' : '240px',
            height: 'auto',
            marginBottom: '24px',
            filter: 'drop-shadow(0 0 30px rgba(0, 102, 255, 0.4))',
            borderRadius: '16px',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        />

        <motion.div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '50px',
            border: '1px solid var(--accent)',
            color: 'var(--accent-light)',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: 600,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Таеквондо клуб
        </motion.div>

        <motion.h1
          style={{
            fontSize: isMobile ? '48px' : 'clamp(48px, 8vw, 96px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #0066ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          ХВАРАН
        </motion.h1>

        <motion.p
          style={{
            fontSize: isMobile ? '15px' : 'clamp(16px, 2vw, 22px)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
            padding: isMobile ? '0 10px' : 0,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Путь воина начинается с первого удара. Система планирования тренировок
          для тренеров и спортсменов клуба.
        </motion.p>

        <motion.button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: isMobile ? '14px 32px' : '16px 40px',
            borderRadius: '50px',
            background: 'var(--gradient-blue)',
            color: '#fff',
            fontSize: isMobile ? '15px' : '16px',
            fontWeight: 600,
            boxShadow: '0 4px 30px rgba(0, 102, 255, 0.4)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(0, 102, 255, 0.6)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('plans')}
        >
          Перейти к планам →
        </motion.button>
      </motion.div>

      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div style={{
            width: '24px',
            height: '40px',
            borderRadius: '12px',
            border: '2px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px',
          }}>
            <motion.div
              style={{ width: '4px', height: '8px', borderRadius: '2px', background: 'var(--accent)' }}
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
