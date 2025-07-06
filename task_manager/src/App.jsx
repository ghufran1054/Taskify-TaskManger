import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage.jsx"
import Navbar from "./components/UI/Navbar.jsx";
import CompletedTasks from "./pages/CompletedTaskPage.jsx";
import SearchResults from "./pages/SearchResultPage.jsx";
import SearchBar from "./components/Dashboard/SearchBar.jsx";
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signup" />;
};

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Navbar/>
      {token && <SearchBar/>}
      <Routes>
        {/* Auto-redirect based on auth */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/signup"} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/completed"
          element={
            <ProtectedRoute>
              <CompletedTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
