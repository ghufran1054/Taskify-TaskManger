import { Calendar, Clock, Tag } from "lucide-react";
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

const getCategoryColor = (categoryName) => {
  const colors = {
    Work: "bg-blue-100 text-blue-800",
    Marketing: "bg-purple-100 text-purple-800",
    Management: "bg-indigo-100 text-indigo-800",
    Development: "bg-green-100 text-green-800",
    "Client Relations": "bg-pink-100 text-pink-800",
    Personal: "bg-gray-100 text-gray-800",
  };
  return colors[categoryName] || "bg-gray-100 text-gray-800";
};

const getDeadlineStatus = (deadline) => {
  const days = getDaysUntilDeadline(deadline);
  if (days < 0)
    return { color: "text-red-600", bg: "bg-red-50", text: "Overdue" };
  if (days === 0)
    return { color: "text-orange-600", bg: "bg-orange-50", text: "Due Today" };
  if (days <= 3)
    return {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      text: `${days} days left`,
    };
  return {
    color: "text-green-600",
    bg: "bg-green-50",
    text: `${days} days left`,
  };
};

const TaskCard = ({ task, handleViewDetails }) => {
  
  const deadlineStatus = getDeadlineStatus(task.deadline);
  return (
    <div
      key={task._id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Task Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 overflow-ellipsis">
            {task.description}
          </p>
        )}

        {/* Category */}
        <div className="flex items-center mb-3">
          <Tag className="w-4 h-4 text-gray-400 mr-2" />
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              task.category?.name || "Uncategorized"
            )}`}
          >
            {task.category?.name || "Uncategorized"}
          </span>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(task.deadline)}</span>
          </div>
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${deadlineStatus.bg} ${deadlineStatus.color}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {deadlineStatus.text}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created {formatDate(task.createdAt)}
          </span>
          <button onClick={() => handleViewDetails(task)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200 cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
