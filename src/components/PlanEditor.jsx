import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  padding: '20px',
};

const modalStyle = {
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--radius-lg)',
  padding: '40px',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow)',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 700,
  marginBottom: '30px',
  background: 'var(--gradient-blue)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const formGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '15px',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical',
};

const exerciseListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '15px',
};

const exerciseItemStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
};

const exerciseInputStyle = {
  ...inputStyle,
  flex: 1,
};

const addBtnStyle = {
  padding: '10px 20px',
  borderRadius: 'var(--radius)',
  border: '1px dashed var(--accent)',
  background: 'transparent',
  color: 'var(--accent-light)',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'all 0.3s',
};

const removeBtnStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '1px solid var(--danger)',
  background: 'transparent',
  color: 'var(--danger)',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s',
};

const actionsStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '30px',
};

const saveBtnStyle = {
  flex: 1,
  padding: '14px',
  borderRadius: 'var(--radius)',
  background: 'var(--gradient-blue)',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)',
  transition: 'all 0.3s',
};

const cancelBtnStyle = {
  flex: 1,
  padding: '14px',
  borderRadius: 'var(--radius)',
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.3s',
};

export default function PlanEditor({ plan, onSave, onClose }) {
  const [title, setTitle] = useState(plan?.title || '');
  const [date, setDate] = useState(plan?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(plan?.description || '');
  const [exercises, setExercises] = useState(plan?.exercises || ['']);

  const handleAddExercise = () => {
    setExercises([...exercises, '']);
  };

  const handleRemoveExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
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
        style={overlayStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={modalStyle}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={titleStyle}>
            {plan ? 'Редактировать план' : 'Новый план тренировки'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Название</label>
              <input
                style={inputStyle}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Техника ног"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Дата</label>
              <input
                style={inputStyle}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Описание</label>
              <textarea
                style={textareaStyle}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание тренировки..."
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Упражнения</label>
              <div style={exerciseListStyle}>
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={index}
                    style={exerciseItemStyle}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '24px' }}>
                      {index + 1}.
                    </span>
                    <input
                      style={exerciseInputStyle}
                      type="text"
                      value={exercise}
                      onChange={(e) => handleExerciseChange(index, e.target.value)}
                      placeholder={`Упражнение ${index + 1}`}
                    />
                    <motion.button
                      type="button"
                      style={removeBtnStyle}
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
                style={addBtnStyle}
                whileHover={{ background: 'rgba(0, 102, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddExercise}
              >
                + Добавить упражнение
              </motion.button>
            </div>

            <div style={actionsStyle}>
              <motion.button
                type="button"
                style={cancelBtnStyle}
                whileHover={{ borderColor: 'var(--text-secondary)', color: '#fff' }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Отмена
              </motion.button>
              <motion.button
                type="submit"
                style={saveBtnStyle}
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
