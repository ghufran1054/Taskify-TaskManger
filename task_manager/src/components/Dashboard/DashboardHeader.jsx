import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';
import { useAuth } from '../../context/AuthContext';
const DashboardHeader = ({ tasks, handleAddTask, handleViewCompleted }) => {

  const { user } = useAuth();
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hi, {user.username}
            </h2>
          </div>
          
          <p className="text-gray-600 text-sm sm:text-base">
            {tasks.length} incomplete {tasks.length === 1 ? "task" : "tasks"} remaining
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleViewCompleted}
            className="px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>View Completed</span>
          </button>
          
          <Button
          className="cursor-pointer"
            onClick={handleAddTask}>
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;