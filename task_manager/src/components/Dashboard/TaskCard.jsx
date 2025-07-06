import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import ConfirmationDialog from '../UI/ConfirmationDialog';
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// const getCategoryColor = (categoryName) => {
//   const colors = {
//     Work: "bg-blue-50 text-blue-700 border border-blue-200",
//     Marketing: "bg-purple-50 text-purple-700 border border-purple-200",
//     Management: "bg-indigo-50 text-indigo-700 border border-indigo-200",
//     Development: "bg-green-50 text-green-700 border border-green-200",
//     "Client Relations": "bg-pink-50 text-pink-700 border border-pink-200",
//     Personal: "bg-gray-50 text-gray-700 border border-gray-200",
//   };
//   return colors[categoryName] || "bg-gray-50 text-gray-700 border border-gray-200";
// };

const getDeadlineStatus = (deadline) => {
  const days = getDaysUntilDeadline(deadline);
  if (days < 0)
    return { 
      color: "text-red-700", 
      bg: "bg-red-50", 
      border: "border-red-200",
      text: "Overdue",
      icon: AlertTriangle,
      pulse: true
    };
  if (days === 0)
    return { 
      color: "text-orange-700", 
      bg: "bg-orange-50", 
      border: "border-orange-200",
      text: "Due Today",
      icon: Clock,
      pulse: true
    };
  if (days <= 3)
    return {
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: `${days} days left`,
      icon: Clock,
      pulse: false
    };
  return {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    text: `${days} days left`,
    icon: Clock,
    pulse: false
  };
};

const TaskCard = ({ task, handleViewDetails, handleMarkComplete, handleDeleteTask }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [purpose, setPurpose] = useState("");
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const StatusIcon = deadlineStatus.icon;

  const handleCompleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmComplete = () => {
    if (purpose === "Mark task as complete") handleMarkComplete(task);
    else if (purpose === "Delete this task") handleDelete();



    setShowConfirmDialog(false);
  };

  const handleDelete = () => {
    handleDeleteTask(task);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        
        <div className="space-y-4">
          {/* Task Title */}
          <div className="flex items-start justify-between">
            <h3 className={`text-lg font-semibold ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {!task.completed && (
              <button
                onClick={() => {
                  handleCompleteClick();
                  setPurpose("Mark task as complete");
                }}
                className="text-green-600 bg-green-100 hover:text-green-700 transition-colors duration-200 cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Task Description */}
          {task.description && (
            <p className={`text-gray-600 overflow-hidden ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          {/* Category */}
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {task.category?.name || "Uncategorized"}
            </span>
          </div>

          {/* Deadline - Only show if task is not completed */}
          {!task.completed && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(task.deadline)}
              </div>
              <div className={`flex items-center text-sm ${deadlineStatus.color}`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {deadlineStatus.text}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Created {formatDate(task.createdAt)}
          </span>
          
          {!task.completed &&  (
            // Show view details button for incomplete tasks
            <button
              onClick={() => handleViewDetails(task)}
              className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200 group cursor-pointer"
            >
              Edit
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          )}
            <button
              onClick={() => {
                handleCompleteClick();
                setPurpose("Delete this task")
              }}
              className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 group"
            >
              <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
              Delete
            </button>
           
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          isOpen={showConfirmDialog}
          title={purpose}
          message="Are you sure you want to continue with this operation?"
          onCancel={() => setShowConfirmDialog(false)}
          setShowConfirmDialog={setShowConfirmDialog}
          handleConfirmComplete={handleConfirmComplete}
        />
      )}
    </>
  );
};
export default TaskCard;