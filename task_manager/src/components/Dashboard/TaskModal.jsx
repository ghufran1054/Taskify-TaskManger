import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  FileText,
  Tag,
  Plus,
  CheckCircle,
  AlertCircle,
  Check,
  Edit3,
  Save,
  RotateCcw,
} from "lucide-react";

import { useCategories } from "../../context/CategoryContext";
import {useCategoryController} from "../../controllers/CategoryController";
import { TaskController } from "../../controllers/TaskController";
import Button from "../UI/Button";

const TaskModal = ({ isOpen, onClose, task = null, mode = "create" }) => {
  const isEditMode = mode === "edit" && task;
  const [isEditing, setIsEditing] = useState(!isEditMode);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    deadline: "",
    deadlineTime: "",
  });
  
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Category creation state
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  
  const {categories} = useCategories();
  const {createCategory} = useCategoryController();
  const {createTask, updateTask} = TaskController();

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      let initialData;
      
      if (isEditMode && task) {
        // Parse the deadline for editing
        const deadline = new Date(task.deadline);
        const deadlineDate = deadline.toISOString().split("T")[0];
        const deadlineTime = deadline.toTimeString().split(" ")[0].substring(0, 5);
        
        initialData = {
          title: task.title || "",
          description: task.description || "",
          category: task.category || "",
          deadline: deadlineDate,
          deadlineTime: deadlineTime,
        };
        setIsEditing(false);
      } else {
        // Creating new task
        initialData = {
          title: "",
          description: "",
          category: "",
          deadline: new Date().toISOString().split("T")[0],
          deadlineTime: new Date().toISOString().split("T")[1].split(".")[0].substring(0, 5),
        };
        setIsEditing(true);
      }
      
      setFormData(initialData);
      setOriginalData(initialData);
      setHasChanges(false);
      setErrors({});
      setNotification(null);
      setShowNewCategoryInput(false);
      setNewCategoryName("");
      setCategoryError("");
      setShowConfirmation(false);
    }
  }, [isOpen, task, isEditMode]);

  // Check for changes
  useEffect(() => {
    if (isEditMode) {
      const hasFormChanges = Object.keys(formData).some(
        key => formData[key] !== originalData[key]
      );
      setHasChanges(hasFormChanges);
    }
  }, [formData, originalData, isEditMode]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        if (showConfirmation) {
          setShowConfirmation(false);
        } else if (showNewCategoryInput) {
          setShowNewCategoryInput(false);
          setNewCategoryName("");
          setCategoryError("");
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, showConfirmation, showNewCategoryInput]);

  const handleClose = () => {
    if (isEditMode && hasChanges && isEditing) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing && hasChanges) {
      setShowConfirmation(true);
    } else {
      setIsEditing(!isEditing);
      if (!isEditing) {
        // Reset to original data when canceling edit
        setFormData(originalData);
      }
    }
  };

  const handleResetForm = () => {
    setFormData(originalData);
    setHasChanges(false);
    setErrors({});
  };

  const handleNewCategoryClick = () => {
    setShowNewCategoryInput(true);
    setNewCategoryName("");
    setCategoryError("");
  };

  const handleCancelNewCategory = () => {
    setShowNewCategoryInput(false);
    setNewCategoryName("");
    setCategoryError("");
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError("Category name is required");
      return;
    }

    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    
    if (existingCategory) {
      setCategoryError("Category already exists");
      return;
    }

    setIsCreatingCategory(true);
    setCategoryError("");

    try {
      await createCategory({ name: newCategoryName.trim() });
      setShowNewCategoryInput(false);
      setNewCategoryName("");
      
      setNotification({
        type: "success",
        message: "Category created successfully!",
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
    } catch (error) {
      setCategoryError(error.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleNewCategoryKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateCategory();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.deadline) {
      newErrors.deadline = "Deadline date is required";
    } else {
      const selectedDate = new Date(
        formData.deadline + " " + (formData.deadlineTime || "23:59")
      );
      const today = new Date();
      if (selectedDate < today) {
        newErrors.deadline = "Deadline cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const deadlineDateTime = new Date(
        formData.deadline + " " + (formData.deadlineTime || "23:59")
      );

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category || null,
        deadline: deadlineDateTime.toISOString(),
      };

      let isSuccess;
      if (isEditMode) {
        isSuccess = await updateTask(task._id, taskData);
      } else {
        isSuccess = await createTask(taskData);
      }

      if (isSuccess) {
        setNotification({
          type: "success",
          message: isEditMode ? "Task updated successfully!" : "Task created successfully!",
        });

        if (isEditMode) {
          setIsEditing(false);
          setHasChanges(false);
          // Update original data to reflect changes
          setOriginalData(formData);
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setNotification({
          type: "error",
          message: isEditMode ? "Failed to update task. Please try again." : "Failed to create task. Please try again.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the task.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bg-black/50 inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {isEditMode ? (
                <Edit3 className="w-5 h-5 mr-2 text-indigo-600" />
              ) : (
                <Plus className="w-5 h-5 mr-2 text-indigo-600" />
              )}
              {isEditMode ? (isEditing ? "Edit Task" : "Task Details") : "Add New Task"}
            </h2>
            <div className="flex items-center space-x-2">
              {isEditMode && (
                <button
                  onClick={handleEditToggle}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isEditing 
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                  disabled={isSubmitting}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mx-6 mt-4 p-4 rounded-lg flex items-center ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              )}
              <span
                className={`text-sm font-medium ${
                  notification.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {notification.message}
              </span>
            </div>
          )}

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Task Title *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter task title"
                  disabled={isSubmitting}
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {formData.title || "No title"}
                </div>
              )}
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              {isEditing ? (
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                  placeholder="Enter task description (optional)"
                  disabled={isSubmitting}
                />
              ) : (
                // TODO
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 flex">
                  {formData.description || "No description"}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Tag className="w-4 h-4 inline mr-2" />
                Category *
              </label>
              
              {isEditing ? (
                !showNewCategoryInput ? (
                  <div className="space-y-2">
                    <select
                      id="category"
                      name="category"
                      value={formData.category?.name || ""}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={handleNewCategoryClick}
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Category
                    </button>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={handleNewCategoryKeyPress}
                        placeholder="Enter category name"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          categoryError ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isCreatingCategory}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 flex items-center"
                      >
                        {isCreatingCategory ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelNewCategory}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        disabled={isCreatingCategory}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {categoryError && (
                      <p className="text-sm text-red-600">{categoryError}</p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Press Enter to create or click the check button
                    </p>
                  </div>
                )
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {categories.find(cat => cat._id === formData.category._id)?.name || "No category"}
                </div>
              )}
            </div>

            {/* Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Deadline Date *
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.deadline ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : "No date"}
                  </div>
                )}
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="deadlineTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    id="deadlineTime"
                    name="deadlineTime"
                    value={formData.deadlineTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {formData.deadlineTime || "No time"}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              {isEditing && isEditMode && hasChanges && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium flex items-center"
                  disabled={isSubmitting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              )}
              
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                {isEditMode && !isEditing ? "Close" : "Cancel"}
              </button>
              
              {isEditing && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <Save className="w-4 h-4 mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isEditMode ? "Save Changes" : "Create Task"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unsaved Changes
              </h3>
              <p className="text-gray-600 mb-6">
                You have unsaved changes. Are you sure you want to leave without saving?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleCancelClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                >
                  Keep Editing
                </button>
                <button
                  onClick={handleConfirmClose}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;