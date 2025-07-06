import { useState, useEffect } from 'react';
import { TaskController } from '../controllers/TaskController';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/Dashboard/TaskList';
import SearchBar from '../components/Dashboard/SearchBar';
import {Clock10, ChevronLeft, ChevronRight} from "lucide-react";
import Button from '../components/UI/Button';
import {useNavigate} from 'react-router-dom';
import Pagination from '../components/UI/Pagination';
// Pagination Component
const CompletedTasks = () => {
  const { completedTasks: tasks } = useTasks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchPaginatedTasks, deleteTask} = TaskController();
  const {page, totalPages} = useTasks();
  const navigate = useNavigate();

  // Handle page change
  const handlePageChange = async (newPage) => {
    try {
      setLoading(true);
      await fetchPaginatedTasks({status: 'completed', page: newPage});
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
        await fetchPaginatedTasks({ status: 'completed' });
        setLoading(false);
      } catch (err) {
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleDelete = async (task) => {
    await deleteTask(task._id);
  };
  return (
    <div  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar/>
        {!loading && tasks.length === 0 && (
        <div className="text-center py-12 flex flex-col">
          {<Clock10 className="w-16 h-16 text-green-500 mx-auto mb-4" />}
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {"No complete Tasks"}
          </h3>
          <p className="text-gray-600">
            {"You have no complete tasks. We are waiting for you !"}
          </p>
          <Button className="max-w-xs mx-auto mt-4" onClick={() => navigate("/dashboard")}>
            Go to dashboard
          </Button>
        </div>
      )}
      <TaskList 
        tasks={tasks} 
        loading={loading} 
        error={error} 
        handleDelete={handleDelete}
        completed={true}
      />
      
      {/* Pagination Component */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default CompletedTasks;