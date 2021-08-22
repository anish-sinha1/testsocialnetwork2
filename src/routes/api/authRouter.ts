import express, { Router } from "express";
import { authJWT } from "../../middleware/auth";
import User from "../../models/userModel";
import { check } from "express-validator";
import { getUser, login } from "../../controllers/userController";

const router = Router();

router
  .route("/")
  .get(authJWT, getUser)
  .post(
    check("email", "please include a valid email address").isEmail(),
    check("password", "password is required").exists(),
    login
  );

export default router;
