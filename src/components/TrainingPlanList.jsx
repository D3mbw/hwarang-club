import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TrainingPlanCard from './TrainingPlanCard';

export default function TrainingPlanList({ plans, isAdmin, onEdit, onDelete, onAdd }) {
  const editHandler = isAdmin ? onEdit : null;
  const deleteHandler = isAdmin ? onDelete : null;
  const addHandler = isAdmin ? onAdd : null;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="plans"
      style={{
        padding: isMobile ? '60px 16px' : '100px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <motion.div
        style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          fontSize: '14px',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontWeight: 600,
          marginBottom: '16px',
        }}>
          Планирование
        </div>
        <h2 style={{
          fontSize: isMobile ? '28px' : 'clamp(32px, 5vw, 48px)',
          fontWeight: 800,
          marginBottom: '16px',
        }}>
          Планы тренировок
        </h2>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto',
        }}>
          Создавайте и управляйте планами тренировок для вашего клуба
        </p>
      </motion.div>

      {plans.length === 0 ? (
        <motion.div
          style={{ textAlign: 'center', padding: isMobile ? '40px 10px' : '80px 20px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.3 }}>📋</div>
          <p style={{ fontSize: '16px', marginBottom: '10px', color: 'var(--text-secondary)' }}>
            Планов пока нет
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Создайте первый план тренировки
          </p>
          {addHandler && (
          <motion.button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '50px',
              background: 'var(--gradient-blue)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 4px 30px rgba(0, 102, 255, 0.4)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(0, 102, 255, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={addHandler}
          >
            + Создать план
          </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}>
            {plans.map((plan, index) => (
              <TrainingPlanCard
                key={plan.id}
                plan={plan}
                onEdit={editHandler}
                onDelete={deleteHandler}
                index={index}
                isMobile={isMobile}
              />
            ))}
          </div>
          {addHandler && (
          <motion.div
            style={{ textAlign: 'center', marginTop: '32px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '50px',
                background: 'var(--gradient-blue)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 4px 30px rgba(0, 102, 255, 0.4)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(0, 102, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              onClick={addHandler}
            >
              + Новый план
            </motion.button>
          </motion.div>
          )}
        </>
      )}
    </section>
  );
}
