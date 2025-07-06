import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

export const TaskController = () => {
  const { token } = useAuth();
  const { setDashboardTasks } = useTasks();

  const fetchDashboardTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks?status=incomplete&limit=20", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard tasks", err);
    }
  };

  const fetchPaginatedTasks = async ({ status = "incomplete", page = 1, limit = 10 }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?status=${status}&page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        return { tasks: data.tasks, total: data.total, totalPages: data.totalPages };
      } else {
        return { tasks: [], total: 0, totalPages: 0 };
      }
    } catch (err) {
      console.error("Failed to fetch paginated tasks", err);
      return { tasks: [], total: 0, totalPages: 0 };
    }
  };

  const createTask = async (task) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      if (res.ok) {
        setDashboardTasks((prev) => [...prev, newTask]);
        return true;
      }
    } catch (err) {
      console.error("Create task failed", err);
      return false;
    }
  }

  const updateTask = async (taskId, task) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      task._id = taskId;
      if (res.ok) {
        setDashboardTasks((prev) => prev.map((t) => (t._id === taskId ? task : t)));
        return true;
      }
    } catch (err) {
      console.error("Update task failed", err);
      return false;
    }
  }
  return {
    fetchDashboardTasks,
    fetchPaginatedTasks,
    createTask, 
    updateTask
  };
};
