import { motion } from 'framer-motion';

const footerStyle = {
  padding: '60px 40px 30px',
  borderTop: '1px solid var(--border)',
  background: 'var(--bg-secondary)',
};

const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '40px',
  marginBottom: '40px',
};

const columnStyle = {};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '2px',
  background: 'var(--gradient-blue)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '16px',
};

const textStyle = {
  color: 'var(--text-secondary)',
  fontSize: '14px',
  lineHeight: 1.8,
};

const headingStyle = {
  fontSize: '14px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: 'var(--text-primary)',
  marginBottom: '20px',
};

const linkStyle = {
  display: 'block',
  color: 'var(--text-secondary)',
  fontSize: '14px',
  marginBottom: '12px',
  transition: 'color 0.3s',
  cursor: 'pointer',
};

const dividerStyle = {
  height: '1px',
  background: 'var(--border)',
  maxWidth: '1200px',
  margin: '0 auto 20px',
};

const copyrightStyle = {
  textAlign: 'center',
  color: 'var(--text-secondary)',
  fontSize: '13px',
  opacity: 0.6,
};

export default function Footer() {
  return (
    <motion.footer
      style={footerStyle}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div style={contentStyle}>
        <div style={columnStyle}>
          <div style={logoStyle}>ХВАРАН</div>
          <p style={textStyle}>
            Клуб таеквондо «Хваран» — путь воина начинается с первого удара.
            Тренировки для всех уровней подготовки.
          </p>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Навигация</h4>
          <motion.a
            href="#hero"
            style={linkStyle}
            whileHover={{ color: '#ffffff', x: 4 }}
          >
            Главная
          </motion.a>
          <motion.a
            href="#plans"
            style={linkStyle}
            whileHover={{ color: '#ffffff', x: 4 }}
          >
            Планы тренировок
          </motion.a>
          <motion.a
            href="#gallery"
            style={linkStyle}
            whileHover={{ color: '#ffffff', x: 4 }}
          >
            Галерея
          </motion.a>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Контакты</h4>
          <p style={textStyle}>
            info@hwarang.club<br />
            +7 (XXX) XXX-XX-XX<br />
            г. Москва
          </p>
        </div>
      </div>

      <div style={dividerStyle} />
      <p style={copyrightStyle}>
        © {new Date().getFullYear()} Хваран — Клуб таеквондо. Все права защищены.
      </p>
    </motion.footer>
  );
}
