const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

categorySchema.index({ userId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model("Category", categorySchema);
