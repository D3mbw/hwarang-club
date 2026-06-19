import { motion } from 'framer-motion';

const sectionStyle = {
  padding: '100px 40px',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '60px',
  alignItems: 'center',
};

const textStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const subtitleStyle = {
  fontSize: '14px',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontWeight: 600,
};

const titleStyle = {
  fontSize: 'clamp(28px, 4vw, 42px)',
  fontWeight: 800,
  lineHeight: 1.2,
};

const descStyle = {
  fontSize: '16px',
  color: 'var(--text-secondary)',
  lineHeight: 1.8,
};

const statsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '10px',
};

const statStyle = {
  textAlign: 'center',
  padding: '20px',
  borderRadius: 'var(--radius)',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
};

const statNumberStyle = {
  fontSize: '32px',
  fontWeight: 800,
  background: 'var(--gradient-blue)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const statLabelStyle = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  marginTop: '6px',
};

const imageContainerStyle = {
  position: 'relative',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  aspectRatio: '1',
  background: 'var(--bg-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoBigStyle = {
  width: '80%',
  height: 'auto',
  objectFit: 'contain',
  filter: 'drop-shadow(0 0 40px rgba(0, 102, 255, 0.3))',
};

const glowStyle = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
  pointerEvents: 'none',
};

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      style={sectionStyle}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div style={textStyle}>
        <motion.div
          style={subtitleStyle}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          О клубе
        </motion.div>

        <motion.h2
          style={titleStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Путь воина начинается с первого удара
        </motion.h2>

        <motion.p
          style={descStyle}
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
          style={statsStyle}
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
              style={statStyle}
              whileHover={{ borderColor: 'var(--accent)', y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div style={statNumberStyle}>{stat.number}</div>
              <div style={statLabelStyle}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        style={imageContainerStyle}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div style={glowStyle} />
        <img
          src="/hwarang-club/logo.jpg"
          alt="Хваран логотип"
          style={logoBigStyle}
        />
      </motion.div>
    </motion.section>
  );
}
