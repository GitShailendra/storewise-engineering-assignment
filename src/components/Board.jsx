import { useState, useEffect } from 'react';
import Task from './Task';
import '../index.css';

const Board = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tasks, setTasks] = useState([]); // Start with an empty array (0 tasks)
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Track selected task for modal
  const [taskStatus, setTaskStatus] = useState('Pending'); // Track task status

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
    console.log("Loaded tasks:", storedTasks); // Log loaded tasks
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if(tasks.length <= 0){
      return;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Saving tasks:", tasks); // Log tasks being saved
  }, [tasks]);

  const increment = () => {
    const newTaskId = tasks.length ? Math.max(...tasks) + 1 : 0;
    const currentDateTime = new Date().toLocaleString(); // Get current date and time

    const updatedTasks = [...tasks, newTaskId];
      sessionStorage.setItem(`task-${newTaskId}`, `Task #${newTaskId + 1} - Created on ${currentDateTime}`);

    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(taskId => taskId !== id);
    setTasks(updatedTasks);
    sessionStorage.removeItem(`task-${id}`);
    sessionStorage.removeItem(`task-status-${id}`);
  };

  const handleStatus = (taskId) => {
    setSelectedTaskId(taskId);
    setIsOpenModal(true);
    setTaskStatus(sessionStorage.getItem(`task-status-${taskId}`) || 'Pending');
  };

  const updateStatus = (newStatus) => {
    setTaskStatus(newStatus);
    sessionStorage.setItem(`task-status-${selectedTaskId}`, newStatus);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="container">
      <h2>Tasks ({tasks.length})</h2>
      <button>Clone Task</button>
      <button onClick={increment}>Create Task</button>
      <ul className="list">
        {tasks.length > 0 ? (
          tasks.map((taskId) => (
            <li key={taskId}>
              <Task id={taskId} />
              <button onClick={() => deleteTask(taskId)}>Delete</button>
              <button onClick={() => handleStatus(taskId)}>Check Status</button>
            </li>
          ))
        ) : (
          <li>No tasks available.</li>
        )}
      </ul>
      {isOpenModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Task Details</h3>
            <p>Status: {taskStatus}</p>
            <select value={taskStatus} onChange={(e) => updateStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
