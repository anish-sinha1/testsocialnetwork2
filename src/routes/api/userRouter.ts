import express, { Router } from "express";
import { registerUser } from "../../controllers/userController";
import { check } from "express-validator";

const router = Router();

/**
 * @route
 * @description
 * @access public
 */

router
  .route("/")
  .post(
    check("name", "name is required").not().isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check("password", "please enter a valid password"),
    registerUser
  );

export default router;
