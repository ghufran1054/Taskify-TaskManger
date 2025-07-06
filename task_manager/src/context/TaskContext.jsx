import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [dashboardTasks, setDashboardTasks] = useState([]); // Preview for dashboard
  const [activeTab, setActiveTab] = useState("incomplete"); // current tab in All Tasks

  return (
    <TaskContext.Provider value={{ dashboardTasks, setDashboardTasks, activeTab, setActiveTab }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);