"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const router = express_1.Router();
router.route("/").get(auth_1.authController);
exports.default = router;
