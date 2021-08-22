import { validationResult } from "express-validator";
import { RequestHandler } from "express";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";

export const registerUser: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "User already exists",
          },
        ],
      });
    }
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    user = new User({
      name,
      email,
      avatar,
      password,
    });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: 3600000,
      },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          token,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: {
        errors: err.message,
      },
    });
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid credentials!",
          },
        ],
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
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
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: 3600000,
      },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          token,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: {
        errors: err.message,
      },
    });
  }
};
