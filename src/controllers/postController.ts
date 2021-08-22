import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import User from "../models/userModel";
import Post, { IComment, IPost } from "../models/postModel";

export const createPost: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user.name, user.avatar, user.id);
    const newPost: IPost = new Post({
      text: req.body.text,
      author: user.name,
      avatar: user.avatar,
      user: req.user.id,
    } as IPost);
    const post = await newPost.save();
    res.status(200).json({
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
};

export const getAllPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json({
      posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
};

export const getPostById: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "no post found" });
    res.status(200).json({
      post,
    });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ message: "no post found" });
    res.status(500).json({ message: "server error" });
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.user.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "failed to authorize" });
    await post.remove();
    res.status(204).json({
      post,
    });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ message: "post not found" });
    res.status(500).json({
      message: "server error",
    });
  }
};

export const likePost: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (
      post.likes.filter((like: any) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ message: "Bad request!" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).json({
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const unlikePost: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    console.log(req.user.id);

    if (
      post.likes.filter(
        (like: any) => like.user.toString() === req.user.id.toString()
      ).length === 0
    ) {
      return res
        .status(400)
        .json({ message: "you can't unlike a post you haven't liked" });
    }

    const removeIndex = post.likes
      .map((like: any) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.status(200).json({
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const createComment: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "bad request" });
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.postId);
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    } as IComment;
    post.comments.unshift(newComment);
    await post.save();
    res.status(201).json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.find(
      (comment: IComment) => comment.id === req.params.commentId
    );
    if (!comment)
      return res.status(404).json({ message: "comment does not exist" });
    if (comment.user.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "user not authorized" });
    const removeIndex = post.comments
      .map((comment: any) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    return res.status(200).json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
};
