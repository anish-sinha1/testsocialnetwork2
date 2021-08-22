"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.getUser = exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const gravatar_1 = __importDefault(require("gravatar"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    const { name, email, password } = req.body;
    try {
        let user = await userModel_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "User already exists",
                    },
                ],
            });
        }
        const avatar = gravatar_1.default.url(email, {
            s: "200",
            r: "pg",
            d: "mm",
        });
        user = new userModel_1.default({
            name,
            email,
            avatar,
            password,
        });
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600000,
        }, (err, token) => {
            if (err)
                throw err;
            return res.status(200).json({
                token,
            });
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            data: {
                errors: err.message,
            },
        });
    }
};
exports.registerUser = registerUser;
const getUser = async (req, res, next) => {
    try {
        const user = await userModel_1.default.findById(req.user.id).select("-password");
        res.status(200).json({
            user,
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
exports.getUser = getUser;
const login = async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    const { email, password } = req.body;
    try {
        let user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "Invalid credentials!",
                    },
                ],
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "Invalid credentials!",
                    },
                ],
            });
        }
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600000,
        }, (err, token) => {
            if (err)
                throw err;
            return res.status(200).json({
                token,
            });
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            data: {
                errors: err.message,
            },
        });
    }
};
exports.login = login;
