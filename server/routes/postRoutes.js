const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
  // Fetch the authenticated user from the header
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
    const newPost = new Post({
      title,
      content,
      author: user.username 
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit a post
router.put('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the user is the author of the post or an admin
    if (post.author !== user.username && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to edit this post' });
    }
    post.title = title;
    post.content = content;
    post.editedAt = new Date();
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error)
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a post
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the user is the author of the post or an admin
    if (post.author !== user.username && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a comment to a post
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const post = await Post.findById(postId);
    const user = await User.findById(req.userId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    post.comments.push({
      content,
      author: user.username,
    });
    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit a comment on a post
router.put('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const post = await Post.findById(postId);
    const user = await User.findById(req.userId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // Check if the user is the author of the comment or an admin
    if (comment.author !== user.username && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to edit this comment' });
    }
    comment.content = content;
    comment.editedAt = new Date();
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a comment on a post
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const user = await User.findById(req.userId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // Check if the user is the author of the comment or an admin
    if (comment.author !== user.username && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }
    comment.deleteOne();
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
