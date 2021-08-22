"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../controllers/userController");
const express_validator_1 = require("express-validator");
const router = express_1.Router();
/**
 * @route
 * @description
 * @access public
 */
router
    .route("/")
    .post(express_validator_1.check("name", "name is required").not().isEmpty(), express_validator_1.check("email", "please include a valid email").isEmail(), express_validator_1.check("password", "please enter a valid password"), userController_1.registerUser);
exports.default = router;
