"use client"
import React, { useState, useEffect } from 'react';
import styles from '../styles/TodoList.module.css';
import TaskModal from './TaskModal';
import { CardGiftcard, MonetizationOn, DesktopMac, ShoppingCart } from '@mui/icons-material';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<{ id: number; task: string; category: string; completed: boolean }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: number; task: string } | null>(null);
  const categories = ['Finanças', 'Casamento', 'Lista de Compras', 'Trabalho'];

  const addTask = (task: string, category: string) => {
    setTasks([...tasks, { id: Date.now(), task, category, completed: false }]);
    closeModal();
  };

  const toggleComplete = (id: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const openDeleteModal = (id: number, taskName: string) => {
    setTaskToDelete({ id, task: taskName });
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
      setTasks(updatedTasks);
      setTaskToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToDelete(null);
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const tasksToDo = tasks.filter((task) => !task.completed);
  const tasksCompleted = tasks.filter((task) => task.completed);

  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.dateHeader}>{formattedDate}</h1>
        <div className={styles.taskStatus}>
          <h3 className={styles.taskStatusItem}>{tasksToDo.length} incompletas,</h3>
          <h3 className={styles.taskStatusItem}>{tasksCompleted.length} completas</h3>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>A fazer</h4>
        {tasksToDo.length === 0 ? (
          <p className={styles.emptyMessage}>Adicione tarefas clicando no botão de +!</p>
        ) : (
          <ul className={styles.taskList}>
            {tasksToDo.map((task) => (
              <li key={task.id} className={styles.task}>
                <div className={styles.taskDescription}>
                  <div className={styles.checkColumn}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className={styles.checkbox}
                    />
                    <div>
                      <span onClick={() => openDeleteModal(task.id, task.task)} className={styles.taskText}>{task.task}</span>
                    </div>
                    {task.category === 'Casamento' && <CardGiftcard className={styles.categoryIconCas} style={{ fontSize: 11 }} />}
                    {task.category === 'Finanças' && <MonetizationOn className={styles.categoryIconFin} style={{ fontSize: 11 }} />}
                    {task.category === 'Trabalho' && <DesktopMac className={styles.categoryIconTra} style={{ fontSize: 11 }} />}
                    {task.category === 'Lista de Compras' && <ShoppingCart className={styles.categoryIconLis} style={{ fontSize: 11}} />}
                    {task.category && <span className={styles.categorySubtitle}>{task.category}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Completas</h4>
        {tasksCompleted.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhuma tarefa completa.</p>
        ) : (
          <ul className={styles.taskList}>
            {tasksCompleted.map((task) => (
              <li
                key={task.id}
                className={`${styles.task} ${task.completed ? styles.taskCompleted : ''}`}
              >
                <div className={styles.taskDescription}>
                  <div className={styles.checkColumn}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className={styles.checkbox}
                    />
                    <div>
                      <span onClick={() => openDeleteModal(task.id, task.task)} className={styles.taskText}>{task.task}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          +
        </button>
      </div>
      {isModalOpen && (
        <div className={styles.modalBackground}>
          <TaskModal onTaskAdd={addTask} categories={categories} onClose={() => setIsModalOpen(false)} />
        </div>
      )}
      {taskToDelete && (
        <div className={styles.modalBackground}>
          <div className={styles.deleteModal}>
            <p>Deseja deletar a tarefa {taskToDelete.task}?</p>
            <button className={styles.cancelButtonModal} onClick={closeModal}>
              Cancelar
            </button>
            <button className={styles.deleteButton} onClick={confirmDelete}>
              Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
