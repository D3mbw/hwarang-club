import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.footer
      style={{
        padding: isMobile ? '40px 20px 24px' : '60px 40px 30px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: isMobile ? '30px' : '40px',
        marginBottom: '40px',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}>
            <img
              src="/hwarang-club/logo.jpg"
              alt="Хваран"
              style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <span style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '2px',
              background: 'var(--gradient-blue)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ХВАРАН
            </span>
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: 1.8,
          }}>
            Клуб таеквондо «Хваран» — путь воина начинается с первого удара.
            Тренировки для всех уровней подготовки.
          </p>
        </div>

        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}>
            Навигация
          </h4>
          {['Главная', 'О клубе', 'Планы тренировок', 'Галерея'].map((item) => (
            <motion.a
              key={item}
              href={`#${item === 'Главная' ? 'hero' : item === 'О клубе' ? 'about' : item === 'Планы тренировок' ? 'plans' : 'gallery'}`}
              style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                marginBottom: '12px',
                cursor: 'pointer',
              }}
              whileHover={{ color: '#ffffff', x: 4 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}>
            Контакты
          </h4>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: 1.8,
          }}>
            info@hwarang.club<br />
            +7 (XXX) XXX-XX-XX<br />
            г. Москва
          </p>
        </div>
      </div>

      <div style={{
        height: '1px',
        background: 'var(--border)',
        maxWidth: '1200px',
        margin: '0 auto 20px',
      }} />
      <p style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '13px',
        opacity: 0.6,
      }}>
        © {new Date().getFullYear()} Хваран — Клуб таеквондо. Все права защищены.
      </p>
    </motion.footer>
  );
}
