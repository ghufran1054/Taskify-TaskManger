import React, { useState, useEffect } from 'react';
import TaskCard from '../components/Dashboard/TaskCard';
import { TaskController } from '../controllers/TaskController';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/Dashboard/TaskList';
import TaskModal from '../components/Dashboard/TaskModal';
import { useCategoryController } from '../controllers/CategoryController';
// Mock data for demonstration - replace with your actual hook
const mockTasks = [
  {
    _id: '1',
    title: 'Complete project proposal',
    description: 'Draft the Q4 project proposal for client review',
    category: { _id: 'cat1', name: 'Work' },
    deadline: new Date('2025-07-01'),
    completed: false,
    createdAt: new Date('2025-07-01')
  },
  {
    _id: '2',
    title: 'Review marketing materials',
    description: 'Check all marketing content for upcoming campaign',
    category: { _id: 'cat2', name: 'Marketing' },
    deadline: new Date('2025-07-10'),
    completed: false,
    createdAt: new Date('2025-07-02')
  },
  {
    _id: '3',
    title: 'Schedule team meeting',
    description: 'Organize weekly sync with development team',
    category: { _id: 'cat3', name: 'Management' },
    deadline: new Date('2025-07-08'),
    completed: false,
    createdAt: new Date('2025-07-03')
  },
  {
    _id: '4',
    title: 'Update documentation',
    description: 'Revise API documentation for new features',
    category: { _id: 'cat4', name: 'Development' },
    deadline: new Date('2025-07-20'),
    completed: false,
    createdAt: new Date('2025-07-04')
  },
  {
    _id: '5',
    title: 'Client feedback review',
    description: 'Analyze client feedback and prepare response',
    category: { _id: 'cat5', name: 'Client Relations' },
    deadline: new Date('2025-07-12'),
    completed: false,
    createdAt: new Date('2025-07-05')
  }
];

const Dashboard = () => {
  const { dashboardTasks: tasks } = useTasks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Modal state
  const [isCreate, setIsCreate] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const { fetchDashboardTasks } = TaskController();
  const {fetchCategories} = useCategoryController();
  // Handle opening the add task modal
  const handleAddTask = () => {
    setIsCreate(true);
    setIsTaskModalOpen(true);
  };

  // Handle closing the add task modal
  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleViewDetails = (task) => {
    setIsCreate(false);
    setIsTaskModalOpen(true);
    setTaskToEdit(task);
  }
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        await fetchDashboardTasks();
        await fetchCategories();
        setLoading(false);
      } catch (err) {
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <>
      <TaskList 
        tasks={tasks} 
        loading={loading} 
        error={error} 
        handleAddTask={handleAddTask}
        handleViewDetails={handleViewDetails}
      />
      
      {/* Add Task Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={handleCloseModal} 
        mode={isCreate ? "create" : "edit"}
        task={taskToEdit}
      />
    </>
  );
};

export default Dashboard;