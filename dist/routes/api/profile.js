"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../middleware/auth");
const userRouter_1 = __importDefault(require("./userRouter"));
/**
 * @route GET api/profile/me
 * @description Get current user's profile
 * @access private
 */
userRouter_1.default.route("/").get(auth_1.authVerify);
