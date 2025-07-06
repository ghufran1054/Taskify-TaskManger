import { useCategories } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";

export const useCategoryController = () => {
  const { token } = useAuth();
  const { setCategories } = useCategories();

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const createCategory = async (category) => {
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });
      const newCategory = await res.json();
      if (res.ok) setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      console.error("Create category failed", err);
    }
  };

  const updateCategory = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => prev.map((c) => (c._id === id ? data : c)));
      }
    } catch (err) {
      console.error("Category update failed", err);
    }
      
  }
  return { fetchCategories, createCategory, updateCategory };
};
