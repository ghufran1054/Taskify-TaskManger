import { useState } from "react";

const NewTaskForm = ({ setTasks }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, category }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
        className="flex-1 p-2 border rounded-md"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Learning">Learning</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
};

export default NewTaskForm;
