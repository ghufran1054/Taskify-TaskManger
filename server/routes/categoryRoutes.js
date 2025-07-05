const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getcategories, createcategory, updatecategory, deletecategory } = require("../controllers/categoryController");

router.use(auth);
router.get("/", getcategories);
router.post("/", createcategory);
router.put("/:id", updatecategory);
router.delete("/:id", deletecategory);

module.exports = router;
