"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const postController = __importStar(require("../../controllers/postController"));
const auth_1 = require("../../middleware/auth");
const router = express_1.Router();
router
    .route("/")
    .get(postController.getAllPosts)
    .post(auth_1.authJWT, express_validator_1.check("text").not().isEmpty(), postController.createPost);
router
    .route("/:postId")
    .get(postController.getPostById)
    .delete(auth_1.authJWT, postController.deletePost);
router.route("/like/:postId").put(auth_1.authJWT, postController.likePost);
router.route("/unlike/:postId").put(auth_1.authJWT, postController.unlikePost);
router
    .route("/comment/:postId")
    .post(auth_1.authJWT, express_validator_1.check("text", "text is required"), postController.createComment);
router
    .route("/comment/:postId/:commentId")
    .delete(auth_1.authJWT, postController.deleteComment);
exports.default = router;
