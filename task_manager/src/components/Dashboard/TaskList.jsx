import TaskCard from "./TaskCard";
import {AlertCircle, } from "lucide-react";
import Button from "../UI/Button";
const TaskList = ({ tasks, loading, error, handleViewDetails, handleMarkComplete, handleDelete}) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Tasks
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            return <TaskCard key={task._id} task={task} handleViewDetails={handleViewDetails} handleMarkComplete={handleMarkComplete} handleDeleteTask={handleDelete} />;
          })}
        </div>
    </div>
  );
};

export default TaskList;
