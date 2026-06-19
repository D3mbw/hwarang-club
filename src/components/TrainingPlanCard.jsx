import { motion } from 'framer-motion';

export default function TrainingPlanCard({ plan, onEdit, onDelete, index, isMobile }) {
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
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: isMobile ? '20px' : '28px',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
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
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(0, 102, 255, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        background: 'rgba(0, 102, 255, 0.1)',
        color: 'var(--accent-light)',
        fontSize: '12px',
        fontWeight: 600,
        marginBottom: '14px',
      }}>
        {formatDate(plan.date)}
      </div>

      <h3 style={{
        fontSize: isMobile ? '18px' : '20px',
        fontWeight: 700,
        marginBottom: '10px',
        color: '#fff',
      }}>
        {plan.title}
      </h3>

      {plan.description && (
        <p style={{
          fontSize: isMobile ? '13px' : '14px',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          lineHeight: 1.6,
        }}>
          {plan.description}
        </p>
      )}

      {plan.exercises.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {plan.exercises.map((ex, i) => (
            <motion.div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: isMobile ? '13px' : '14px',
                color: 'var(--text-secondary)',
              }}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                flexShrink: 0,
              }} />
              {ex}
            </motion.div>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '14px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border)',
      }}>
        <motion.button
          style={{
            padding: isMobile ? '8px 14px' : '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            background: 'rgba(0, 102, 255, 0.1)',
            color: 'var(--accent-light)',
            border: '1px solid rgba(0, 102, 255, 0.2)',
          }}
          whileHover={{ background: 'rgba(0, 102, 255, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(plan)}
        >
          Изменить
        </motion.button>
        <motion.button
          style={{
            padding: isMobile ? '8px 14px' : '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            background: 'rgba(255, 68, 68, 0.1)',
            color: 'var(--danger)',
            border: '1px solid rgba(255, 68, 68, 0.2)',
          }}
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
