const Category = require("../models/category");

exports.getcategories = async (req, res) => {
  const categorys = await Category.find({ userId: req.user.userId });
  res.json(categorys);
};

exports.createcategory = async (req, res) => {
  const category = new category({ ...req.body, userId: req.user.userId });
  await category.save();
  res.status(201).json(category);
};

exports.updatecategory = async (req, res) => {
  const category = await category.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(category);
};

exports.deletecategory = async (req, res) => {
  await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.status(204).end();
};
