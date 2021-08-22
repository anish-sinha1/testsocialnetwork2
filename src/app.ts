import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database";
import userRouter from "./routes/api/userRouter";
import authRouter from "./routes/api/authRouter";
import profileRouter from "./routes/api/profileRouter";
import postRouter from "./routes/api/postRouter";

dotenv.config({ path: "src/config/config.env" });

const app = express();
app.use(express.json());

connectDB();

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
