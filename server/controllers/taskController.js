const Task = require("../models/task");

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Query params
    const { status, sort = "asc", page = 1, limit = 10 } = req.query;

    // Build the filter object
    const filter = { userId };
    if (status === "completed") filter.completed = true;
    if (status === "incomplete") filter.completed = false;

    // Pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = sort === "desc" ? -1 : 1;

    // Query with pagination, filtering, sorting
    const tasks = await Task.find(filter)
      .sort({ deadline: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category");

    // Optional: Total count for pagination
    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.createTask = async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user.userId });
  await task.save();
  await task.populate('category');
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  await task.populate('category');
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.status(204).end();
};
