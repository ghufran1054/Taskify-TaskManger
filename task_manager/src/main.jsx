import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { CategoryProvider } from "./context/CategoryContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CategoryProvider>
      <TaskProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TaskProvider>
    </CategoryProvider>
  </React.StrictMode>
);
