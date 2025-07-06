import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [pendingTasks, setPendingTasks] = useState([]); // Preview for dashboard
  const [completedTasks, setCompletedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState({});
  const [searchTasks, setSearchTasks] = useState([]);
  

  return (
    <TaskContext.Provider value={{ pendingTasks, setPendingTasks, page, setPage, totalPages, setTotalPages, completedTasks, setCompletedTasks, searchQuery, setSearchQuery, searchTasks, setSearchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);