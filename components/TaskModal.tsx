import React, { useState } from 'react';
import Select from 'react-select';
import styles from '../styles/TaskModal.module.css';

interface TaskModalProps {
  onTaskAdd: (task: string, category: string) => void;
  categories: string[];
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onTaskAdd, categories, onClose }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(null);
  const [modalExpanded, setModalExpanded] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const addTask = () => {
    if (newTask.trim() !== '' && selectedCategory) {
      onTaskAdd(newTask, selectedCategory.value);
      setNewTask('');
      setSelectedCategory(null);
    }
  };

  const toggleSelect = () => {
    setModalExpanded(!modalExpanded);
  };

  return (
    <div className={`${styles.modalContainer} ${modalExpanded ? styles.expanded : ''}`}>
      <h1 className={styles.title}>Adicionar Tarefa</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={`${styles.input} ${newTask && styles.inputFilled}`}
          placeholder=" "
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onFocus={() => setModalExpanded(true)}
          onBlur={() => setModalExpanded(false)}
        />
        <label className={styles.inputLabel}>Tarefa</label>
      </div>
      <div className={`${styles.categorySelect} ${modalExpanded ? styles.expanded : ''}`}>
        <Select
          value={selectedCategory}
          onChange={(selectedOption) => setSelectedCategory(selectedOption)}
          options={categoryOptions}
          placeholder="Categoria"
          onMenuOpen={toggleSelect}
          onMenuClose={toggleSelect}
          styles={{
            input: (provided) => ({
              ...provided,
              height: '42px',
              fontSize: '15px',
            }),
          }}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancelar
        </button>
        <button className={styles.addButton} onClick={addTask}>
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
