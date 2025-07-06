import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

export const TaskController = () => {
  const { token } = useAuth();
  const { setPendingTasks, setCompletedTasks, setPage, setTotalPages, setSearchTasks } = useTasks();

  const fetchPendingTasks = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/tasks?status=incomplete&limit=20",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setPendingTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard tasks", err);
    }
  };

  const fetchPaginatedTasks = async ({
    status = "incomplete",
    page = 1,
    limit = 10,
  }) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks?status=${status}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        if (status === "incomplete") {
          setPendingTasks(data.tasks);
        } else {
          setCompletedTasks(data.tasks);
        }
        setTotalPages(data.totalPages);
        setPage(data.page);
      } else {
        setCompletedTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch paginated tasks", err);

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
        setPendingTasks((prev) => [...prev, newTask]);
        return true;
      }
    } catch (err) {
      console.error("Create task failed", err);
      return false;
    }
  };

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
        if (task.completed === true) {
          // remove it from pending tasks and add it to completed tasks
          setPendingTasks((prev) => prev.filter((t) => t._id !== taskId));
          setCompletedTasks((prev) => [...prev, task]);
        } else {
          setPendingTasks((prev) =>
            prev.map((t) => (t._id === taskId ? task : t))
          );
        }
        return true;
      }
    } catch (err) {
      console.error("Update task failed", err);
      return false;
    }
  };
  const filterTasks = async (queryObj) => {

    // form query string from query object
    let query = ""
    for (const [key, value] of Object.entries(queryObj)) {
      console.log("print",value);
      if (value) {
        query += `${key}=${value.toString()}&`;
      }
    }
    query = query.slice(0, -1);

    // console.log(queryObj);
    console.log(query);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTotalPages(data.totalPages);
        setPage(data.page);
        setSearchTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to search tasks", err);
      return false;
    }
  }
  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPendingTasks((prev) => prev.filter((t) => t._id !== taskId));
        setCompletedTasks((prev) => prev.filter((t) => t._id !== taskId));
        return true;
      }
    } catch (err) {
      console.error("Delete task failed", err);
      return false;
    }
  }
  return {
    fetchPendingTasks,
    fetchPaginatedTasks,
    createTask,
    updateTask,
    deleteTask,
    filterTasks
  };
};
