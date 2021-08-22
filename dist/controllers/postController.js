"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.unlikePost = exports.likePost = exports.deletePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const createPost = async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    try {
        const user = await userModel_1.default.findById(req.user.id).select("-password");
        console.log(user.name, user.avatar, user.id);
        const newPost = new postModel_1.default({
            text: req.body.text,
            author: user.name,
            avatar: user.avatar,
            user: req.user.id,
        });
        const post = await newPost.save();
        res.status(200).json({
            post,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "server error",
        });
    }
};
exports.createPost = createPost;
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postModel_1.default.find().sort({ date: -1 });
        res.status(200).json({
            posts,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "server error",
        });
    }
};
exports.getAllPosts = getAllPosts;
const getPostById = async (req, res, next) => {
    try {
        const post = await postModel_1.default.findById(req.params.postId);
        if (!post)
            return res.status(404).json({ message: "no post found" });
        res.status(200).json({
            post,
        });
    }
    catch (err) {
        if (err.kind === "ObjectId")
            return res.status(404).json({ message: "no post found" });
        res.status(500).json({ message: "server error" });
    }
};
exports.getPostById = getPostById;
const deletePost = async (req, res, next) => {
    try {
        const post = await postModel_1.default.findById(req.params.postId);
        if (!post)
            return res.status(404).json({ message: "post not found" });
        if (post.user.toString() !== req.user.id.toString())
            return res.status(403).json({ message: "failed to authorize" });
        await post.remove();
        res.status(204).json({
            post,
        });
    }
    catch (err) {
        if (err.kind === "ObjectId")
            return res.status(404).json({ message: "post not found" });
        res.status(500).json({
            message: "server error",
        });
    }
};
exports.deletePost = deletePost;
const likePost = async (req, res, next) => {
    try {
        const post = await postModel_1.default.findById(req.params.postId);
        if (post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0) {
            return res.status(400).json({ message: "Bad request!" });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.status(200).json({
            likes: post.likes,
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.likePost = likePost;
const unlikePost = async (req, res, next) => {
    try {
        const post = await postModel_1.default.findById(req.params.postId);
        console.log(req.user.id);
        if (post.likes.filter((like) => like.user.toString() === req.user.id.toString()).length === 0) {
            return res
                .status(400)
                .json({ message: "you can't unlike a post you haven't liked" });
        }
        const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.status(200).json({
            likes: post.likes,
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.unlikePost = unlikePost;
const createComment = async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: "bad request" });
    try {
        const user = await userModel_1.default.findById(req.user.id).select("-password");
        const post = await postModel_1.default.findById(req.params.postId);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        };
        post.comments.unshift(newComment);
        await post.save();
        res.status(201).json({ comments: post.comments });
    }
    catch (err) {
        res.status(500).json({
            message: "server error",
        });
    }
};
exports.createComment = createComment;
const deleteComment = async (req, res, next) => {
    try {
        const post = await postModel_1.default.findById(req.params.postId);
        const comment = post.comments.find((comment) => comment.id === req.params.commentId);
        if (!comment)
            return res.status(404).json({ message: "comment does not exist" });
        if (comment.user.toString() !== req.user.id.toString())
            return res.status(403).json({ message: "user not authorized" });
        const removeIndex = post.comments
            .map((comment) => comment.user.toString())
            .indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        return res.status(200).json({ comments: post.comments });
    }
    catch (err) { }
};
exports.deleteComment = deleteComment;
