import { motion } from 'framer-motion';

const cardStyle = {
  background: 'var(--bg-card)',
  borderRadius: 'var(--radius-lg)',
  padding: '28px',
  border: '1px solid var(--border)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
};

const glowStyle = {
  position: 'absolute',
  top: '-50%',
  right: '-50%',
  width: '200%',
  height: '200%',
  background: 'radial-gradient(circle, rgba(0, 102, 255, 0.05) 0%, transparent 70%)',
  pointerEvents: 'none',
};

const dateBadgeStyle = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  background: 'rgba(0, 102, 255, 0.1)',
  color: 'var(--accent-light)',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '16px',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '12px',
  color: '#fff',
};

const descStyle = {
  fontSize: '14px',
  color: 'var(--text-secondary)',
  marginBottom: '20px',
  lineHeight: 1.6,
};

const exercisesStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '20px',
};

const exerciseItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  color: 'var(--text-secondary)',
};

const bulletStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'var(--accent)',
  flexShrink: 0,
};

const actionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid var(--border)',
};

const actionBtnStyle = {
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  transition: 'all 0.3s',
};

const editBtnStyle = {
  ...actionBtnStyle,
  background: 'rgba(0, 102, 255, 0.1)',
  color: 'var(--accent-light)',
  border: '1px solid rgba(0, 102, 255, 0.2)',
};

const deleteBtnStyle = {
  ...actionBtnStyle,
  background: 'rgba(255, 68, 68, 0.1)',
  color: 'var(--danger)',
  border: '1px solid rgba(255, 68, 68, 0.2)',
};

export default function TrainingPlanCard({ plan, onEdit, onDelete, index }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        borderColor: 'rgba(0, 102, 255, 0.3)',
        boxShadow: 'var(--shadow-hover)',
        y: -4,
      }}
    >
      <div style={glowStyle} />
      <div style={dateBadgeStyle}>{formatDate(plan.date)}</div>
      <h3 style={titleStyle}>{plan.title}</h3>
      {plan.description && <p style={descStyle}>{plan.description}</p>}
      {plan.exercises.length > 0 && (
        <div style={exercisesStyle}>
          {plan.exercises.map((ex, i) => (
            <motion.div
              key={i}
              style={exerciseItemStyle}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div style={bulletStyle} />
              {ex}
            </motion.div>
          ))}
        </div>
      )}
      <div style={actionsStyle}>
        <motion.button
          style={editBtnStyle}
          whileHover={{ background: 'rgba(0, 102, 255, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(plan)}
        >
          Изменить
        </motion.button>
        <motion.button
          style={deleteBtnStyle}
          whileHover={{ background: 'rgba(255, 68, 68, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(plan.id)}
        >
          Удалить
        </motion.button>
      </div>
    </motion.div>
  );
}
