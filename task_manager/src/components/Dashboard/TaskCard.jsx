const TaskCard = ({ task }) => (
  <div className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-start">
    <div>
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-sm text-gray-500">
        Category: {task.category || "Uncategorized"}
      </p>
      {task.deadline && (
        <p className="text-sm text-red-500">
          Deadline: {new Date(task.deadline).toLocaleDateString()}
        </p>
      )}
    </div>
    {task.completed && (
      <span className="text-green-600 font-semibold text-sm">Done</span>
    )}
  </div>
);

export default TaskCard;
    