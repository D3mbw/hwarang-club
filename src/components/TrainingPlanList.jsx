import { motion } from 'framer-motion';
import TrainingPlanCard from './TrainingPlanCard';

const sectionStyle = {
  padding: '100px 40px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '60px',
};

const subtitleStyle = {
  fontSize: '14px',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontWeight: 600,
  marginBottom: '16px',
};

const titleStyle = {
  fontSize: 'clamp(32px, 5vw, 48px)',
  fontWeight: 800,
  marginBottom: '16px',
};

const descStyle = {
  fontSize: '16px',
  color: 'var(--text-secondary)',
  maxWidth: '500px',
  margin: '0 auto',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '24px',
};

const emptyStyle = {
  textAlign: 'center',
  padding: '80px 20px',
  color: 'var(--text-secondary)',
};

const emptyIconStyle = {
  fontSize: '64px',
  marginBottom: '20px',
  opacity: 0.3,
};

const addBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 32px',
  borderRadius: '50px',
  background: 'var(--gradient-blue)',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: '0 4px 30px rgba(0, 102, 255, 0.4)',
  marginTop: '20px',
  transition: 'all 0.3s',
};

export default function TrainingPlanList({ plans, onEdit, onDelete, onAdd }) {
  return (
    <section id="plans" style={sectionStyle}>
      <motion.div
        style={headerStyle}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={subtitleStyle}>Планирование</div>
        <h2 style={titleStyle}>Планы тренировок</h2>
        <p style={descStyle}>
          Создавайте и управляйте планами тренировок для вашего клуба
        </p>
      </motion.div>

      {plans.length === 0 ? (
        <motion.div
          style={emptyStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div style={emptyIconStyle}>📋</div>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Планов пока нет</p>
          <p style={{ fontSize: '14px' }}>Создайте первый план тренировки</p>
          <motion.button
            style={addBtnStyle}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(0, 102, 255, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdd}
          >
            + Создать план
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div style={gridStyle}>
            {plans.map((plan, index) => (
              <TrainingPlanCard
                key={plan.id}
                plan={plan}
                onEdit={onEdit}
                onDelete={onDelete}
                index={index}
              />
            ))}
          </div>
          <motion.div
            style={{ textAlign: 'center', marginTop: '40px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              style={addBtnStyle}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(0, 102, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdd}
            >
              + Новый план
            </motion.button>
          </motion.div>
        </>
      )}
    </section>
  );
}
