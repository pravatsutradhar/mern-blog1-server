// backend/controllers/commentController.js
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// @desc Add a comment to a post
// @route POST /api/comments/:postId
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      post: post._id,
      user: req.user.id,
      content,
    });

    await comment.save();

    // add comment reference to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error("AddComment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all approved comments for a post
// @route GET /api/comments/:postId
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, status: "approved" })
      .populate("user", "name avatar")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error("GetComments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Approve or reject a comment
// @route PUT /api/comments/:id/status
export const moderateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    comment.status = status;
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error("ModerateComment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete a comment
// @route DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author or Admin/Editor can delete
    if (comment.user.toString() !== req.user.id && !["Admin", "Editor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("DeleteComment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
