// backend/controllers/postController.js
import Post from "../models/Post.js";

// @desc Create a new post
// @route POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = new Post({
      title,
      content,
      excerpt,
      featuredImage,
      status,
      author: req.user.id,
      publishedAt: status === "published" ? new Date() : null,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("CreatePost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all posts (public, only published)
// @route GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GetPosts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get single post by slug
// @route GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author", "name email avatar");
    if (!post || post.status !== "published") {
      return res.status(404).json({ message: "Post not found" });
    }
    // increment views
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("GetPostBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update post
// @route PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author or admin can update
    if (post.author.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, content, excerpt, featuredImage, status } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (featuredImage) post.featuredImage = featuredImage;
    if (status) {
      post.status = status;
      if (status === "published" && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("UpdatePost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete post
// @route DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("DeletePost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
