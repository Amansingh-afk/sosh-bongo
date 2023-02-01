const Blog = require("../models/blogModel");

exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user._id,
      createdOn: Date.now(),
    });
    const savedBlog = await newBlog.save();
    res.status(201).json({
      success: true,
      data: savedBlog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error creating blog post",
      error: err.message,
    });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error fetching blog posts",
      error: err,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { $set: { title: req.body.title, description: req.body.description } },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(400).json({
        success: false,
        msg: "Blog post not found or unauthorized to update",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error updating blog post",
      error: err,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deletedBlog) {
      return res.status(500).json({
        success: false,
        msg: "Blog post not found or unauthorized to delete",
      });
    }
    res.status(200).json({
      success: true,
      msg: "Blog post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error deleting blog post",
      error: err,
    });
  }
};
