import React, { useState, useEffect } from 'react';
import TaskCard from '../components/Dashboard/TaskCard';
import { TaskController } from '../controllers/TaskController';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/Dashboard/TaskList';
import TaskModal from '../components/Dashboard/TaskModal';
import { useCategoryController } from '../controllers/CategoryController';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import {useNavigate} from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Pagination from '../components/UI/Pagination';
// Pagination Component



const Dashboard = () => {
  const { pendingTasks: tasks } = useTasks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Modal state
  const [isCreate, setIsCreate] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const { fetchPaginatedTasks, updateTask, deleteTask} = TaskController();
  const {page, totalPages} = useTasks();
  const {fetchCategories} = useCategoryController();

  const navigate = useNavigate();
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

  // Handle page change
  const handlePageChange = async (newPage) => {
    try {
      setLoading(true);
      await fetchPaginatedTasks({status: 'incomplete', page: newPage});
      setLoading(false);
    } catch (err) {
      setError('Failed to load tasks');
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        await fetchPaginatedTasks({status: 'incomplete'});
        await fetchCategories();
        setLoading(false);
      } catch (err) {
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleViewCompleted = () => {
    navigate('/completed');
  };

  const handleMarkComplete = async (task) => {
    task.completed = true;
    await updateTask(task._id, task);

  };

  const handleDelete = async (task) => {
    await deleteTask(task._id);
  };


  return (
    <div  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader tasks={tasks} handleAddTask={handleAddTask} handleViewCompleted={handleViewCompleted}/>
      {!loading && tasks.length === 0 && (
        <div className="text-center py-12 flex flex-col">
          {<CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />}
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {"No Incomplete Tasks"}
          </h3>
          <p className="text-gray-600">
            {"You have no incomplete tasks. Great Job !"}
          </p>
        </div>
      )}
      <TaskList 
        tasks={tasks} 
        loading={loading} 
        error={error} 
        handleAddTask={handleAddTask}
        handleViewDetails={handleViewDetails}
        handleMarkComplete={handleMarkComplete}
        handleDelete={handleDelete}
      />
      
      {/* Pagination Component */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
      
      {/* Add Task Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={handleCloseModal} 
        mode={isCreate ? "create" : "edit"}
        task={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;