"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authJWT = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(403).json({
            msg: "Invalid or expired token",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (_a) {
        res.status(403).json({
            msg: "Invalid or expired token!",
        });
    }
};
exports.authJWT = authJWT;
