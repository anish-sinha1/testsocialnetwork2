import jwt from "jsonwebtoken";
import { RequestHandler, Request } from "express";
import User, { IUser } from "../models/userModel";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import gravatar from "gravatar";

interface IToken {
  user: IUser;
}

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
  }
}

export const authJWT: RequestHandler = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(403).json({
      msg: "Invalid or expired token",
    });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as IToken;

    req.user = decoded.user;

    next();
  } catch {
    res.status(403).json({
      msg: "Invalid or expired token!",
    });
  }
};
