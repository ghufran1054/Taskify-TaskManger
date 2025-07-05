import TaskCard from "./TaskCard";

const TaskList = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No current tasks.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
