const express = require("express");
const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

router.route("/blog").get(getBlogs).post(isLoggedIn, createBlog);
router.route("/blog/:id").put(isLoggedIn, updateBlog).delete(isLoggedIn, deleteBlog);

module.exports = router;
