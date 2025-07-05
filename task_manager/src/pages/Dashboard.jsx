import { useState, useEffect } from "react";
import TaskList from "../components/Dashboard/TaskList";
import SearchBar from "../components/Dashboard/SearchBar";
import CategoryFilter from "../components/Dashboard/CategoryFilter";
import NewTaskForm from "../components/Dashboard/NewTaskForm";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sample fetch logic - replace with real fetch using fetch + token
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      });
  }, []);

  // Filter tasks when search or category changes
  useEffect(() => {
    let filtered = tasks;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((task) => task.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [searchQuery, selectedCategory, tasks]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Your Tasks</h1>

      <div className="flex flex-col sm:flex-row gap-2">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter setSelectedCategory={setSelectedCategory} />
      </div>

      <NewTaskForm setTasks={setTasks} />

      <TaskList tasks={filteredTasks} />
    </div>
  );
};

export default DashboardPage;
