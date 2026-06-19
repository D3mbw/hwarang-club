import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlanEditor({ plan, onSave, onClose }) {
  const [title, setTitle] = useState(plan?.title || '');
  const [date, setDate] = useState(plan?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(plan?.description || '');
  const [exercises, setExercises] = useState(plan?.exercises || ['']);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddExercise = () => setExercises([...exercises, '']);
  const handleRemoveExercise = (index) => {
    if (exercises.length > 1) setExercises(exercises.filter((_, i) => i !== index));
  };
  const handleExerciseChange = (index, value) => {
    const updated = [...exercises];
    updated[index] = value;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: plan?.id || Date.now().toString(),
      title: title.trim(),
      date,
      description: description.trim(),
      exercises: exercises.filter((ex) => ex.trim()),
      createdAt: plan?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: isMobile ? '10px' : '20px',
          overflowY: 'auto',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: isMobile ? '16px' : 'var(--radius-lg)',
            padding: isMobile ? '24px 18px' : '40px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: isMobile ? '95vh' : '90vh',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            marginTop: isMobile ? '50px' : 0,
          }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 700,
            marginBottom: isMobile ? '20px' : '30px',
            background: 'var(--gradient-blue)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {plan ? 'Редактировать план' : 'Новый план тренировки'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Название
              </label>
              <input
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 14px' : '14px 18px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                }}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Техника ног"
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Дата
              </label>
              <input
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 14px' : '14px 18px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                }}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Описание
              </label>
              <textarea
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 14px' : '14px 18px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  minHeight: isMobile ? '80px' : '120px',
                  resize: 'vertical',
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание тренировки..."
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Упражнения
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={index}
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '22px', fontSize: '14px' }}>
                      {index + 1}.
                    </span>
                    <input
                      style={{
                        flex: 1,
                        padding: isMobile ? '10px 12px' : '14px 18px',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                      }}
                      type="text"
                      value={exercise}
                      onChange={(e) => handleExerciseChange(index, e.target.value)}
                      placeholder={`Упражнение ${index + 1}`}
                    />
                    <motion.button
                      type="button"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: '1px solid var(--danger)',
                        background: 'transparent',
                        color: 'var(--danger)',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      whileHover={{ background: 'var(--danger)', color: '#fff' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveExercise(index)}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              <motion.button
                type="button"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius)',
                  border: '1px dashed var(--accent)',
                  background: 'transparent',
                  color: 'var(--accent-light)',
                  fontSize: '14px',
                  fontWeight: 600,
                  width: isMobile ? '100%' : 'auto',
                }}
                whileHover={{ background: 'rgba(0, 102, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddExercise}
              >
                + Добавить упражнение
              </motion.button>
            </div>

            <div style={{
              display: 'flex',
              gap: isMobile ? '10px' : '15px',
              marginTop: isMobile ? '20px' : '30px',
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              <motion.button
                type="button"
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius)',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
                whileHover={{ borderColor: 'var(--text-secondary)', color: '#fff' }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Отмена
              </motion.button>
              <motion.button
                type="submit"
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--gradient-blue)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)',
                }}
                whileHover={{ boxShadow: '0 8px 40px rgba(0, 102, 255, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                Сохранить
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
