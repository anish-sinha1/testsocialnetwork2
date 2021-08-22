import express, { Router } from "express";
import { check } from "express-validator";
import * as postController from "../../controllers/postController";
import { authJWT } from "../../middleware/auth";
const router = Router();

router
  .route("/")
  .get(postController.getAllPosts)
  .post(authJWT, check("text").not().isEmpty(), postController.createPost);

router
  .route("/:postId")
  .get(postController.getPostById)
  .delete(authJWT, postController.deletePost);

router.route("/like/:postId").put(authJWT, postController.likePost);
router.route("/unlike/:postId").put(authJWT, postController.unlikePost);

router
  .route("/comment/:postId")
  .post(
    authJWT,
    check("text", "text is required"),
    postController.createComment
  );

router
  .route("/comment/:postId/:commentId")
  .delete(authJWT, postController.deleteComment);

export default router;
