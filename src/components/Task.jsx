import { useEffect, useState } from 'react';

const Task = ({ id }) => {
  const [taskName, setTaskName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const storedName = sessionStorage.getItem(`task-${id}`);
    const defaultTaskName = `Task #${id + 1}`;

    if (!storedName) {
      const defaultTaskName = `Task #${id + 1} - Created on ${new Date().toLocaleString()}`;
      sessionStorage.setItem(`task-${id}`, defaultTaskName);
      setTaskName(defaultTaskName);
    } else {
      setTaskName(storedName);
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setNewTaskName(taskName);
  };

  const handleSave = () => {
    sessionStorage.setItem(`task-${id}`, newTaskName);
    setTaskName(newTaskName);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          {taskName}
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
    </>
  );
};

export default Task;
