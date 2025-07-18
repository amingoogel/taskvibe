import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState('LOW');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/tasks/').then(response => setTasks(response.data));
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/', {
        title,
        description,
        energy_level: energyLevel,
        due_date: dueDate
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      alert('Failed to add task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.post(`http://localhost:8000/api/tasks/${taskId}/complete/`);
      setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: true } : task));
    } catch (error) {
      alert('Failed to complete task');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task Title"
        className="border p-2 mb-2 w-full rounded"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Task Description"
        className="border p-2 mb-2 w-full rounded"
      />
      <select
        value={energyLevel}
        onChange={e => setEnergyLevel(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      >
        <option value="LOW">Low Energy</option>
        <option value="MEDIUM">Medium Energy</option>
        <option value="HIGH">High Energy</option>
      </select>
      <input
        type="datetime-local"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <button onClick={handleAddTask} className="bg-blue-500 text-white p-2 rounded w-full">
        Add Task
      </button>
      <h3 className="text-xl font-semibold mt-6 mb-2">Your Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="border p-2 mb-2 flex justify-between items-center">
            <span>
              {task.title} - {task.description} ({task.energy_level})
              {task.completed && <span className="text-green-500 ml-2">✔</span>}
            </span>
            {!task.completed && (
              <button
                onClick={() => handleCompleteTask(task.id)}
                className="bg-green-500 text-white p-1 rounded"
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;