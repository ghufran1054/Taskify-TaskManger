import React, { useState, useEffect } from 'react';
import { TaskController } from '../controllers/TaskController';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/Dashboard/TaskList';
import SearchBar from '../components/Dashboard/SearchBar';
import TaskModal from '../components/Dashboard/TaskModal';
import Pagination from '../components/UI/Pagination';
import { useNavigate } from 'react-router-dom';
import { Clock10 } from 'lucide-react';
const SearchResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { filterTasks, updateTask, deleteTask} = TaskController();
  const {searchQuery, setSearchQuery, searchTasks: tasks} = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Modal state
  const [isCreate, setIsCreate] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const {page, totalPages} = useTasks();
  const navigate = useNavigate();
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        await filterTasks(searchQuery);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    loadTasks();
  }, [searchQuery]);

  const handleViewDetails = (task) => {
    setIsCreate(false);
    setIsTaskModalOpen(true);
    setTaskToEdit(task);
  }

  // Handle page change
  const handlePageChange = async (newPage) => {

    // Set this new page in the searchQueryObject

    setSearchQuery({...searchQuery, page: newPage});

    try {
      setLoading(true);
      await filterTasks(searchQuery);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tasks');
      setLoading(false);
    }

  };

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

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
  };

  return (
    <div  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar/>
      { // Giving message for no search results
        !loading && !error && tasks.length === 0 && (
        <div className="text-center py-12 flex flex-col">
          {<Clock10 className="w-16 h-16 text-green-500 mx-auto mb-4" />}
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {"No search results"}
          </h3>
          <p className="text-gray-600">
            {"No search results found"}
          </p>
        </div>
        )
      }
      <TaskList 
        tasks={tasks} 
        loading={loading} 
        error={error} 
        handleDelete={handleDelete}
        completed={true}
        handleViewDetails={handleViewDetails}
        handleMarkComplete={handleMarkComplete}
        handleViewCompleted={handleViewCompleted}
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
export default SearchResults;