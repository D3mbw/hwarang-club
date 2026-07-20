import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.section
      id="about"
      style={{
        padding: isMobile ? '60px 20px' : '100px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: isMobile ? '40px' : '60px',
        alignItems: 'center',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          style={{
            fontSize: '14px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            fontWeight: 600,
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          О клубе
        </motion.div>

        <motion.h2
          style={{
            fontSize: isMobile ? '28px' : 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            lineHeight: 1.2,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Путь воина начинается с первого удара
        </motion.h2>

        <motion.p
          style={{
            fontSize: isMobile ? '15px' : '16px',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Клуб таеквондо «Хваран» — это место, где формируются настоящие воины.
          Мы обучаем таеквондо всех возрастов и уровней подготовки — от
          начинающих до мастеров. Наша цель — не только физическое развитие, но
          и воспитание характера, дисциплины и уважения.
        </motion.p>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: isMobile ? '10px' : '20px',
            marginTop: '10px',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {[
            { number: '5+', label: 'Лет опыта' },
            { number: '100+', label: 'Учеников' },
            { number: '50+', label: 'Медалей' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              style={{
                textAlign: 'center',
                padding: isMobile ? '14px 8px' : '20px',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
              whileHover={{ borderColor: 'var(--accent)', y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 800,
                background: 'var(--gradient-blue)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: isMobile ? '11px' : '13px',
                color: 'var(--text-secondary)',
                marginTop: '6px',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          aspectRatio: '1',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: isMobile ? '280px' : 'none',
          margin: isMobile ? '0 auto' : '0',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <img
          src="/logo.jpg"
          alt="Хваран логотип"
          style={{
            width: '80%',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 40px rgba(0, 102, 255, 0.3))',
          }}
        />
      </motion.div>
    </motion.section>
  );
}
