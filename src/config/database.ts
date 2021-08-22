import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "src/config/config.env" });

const connectDB = async () => {
  try {
    const currentDate = new Date();
    const DB: string = process.env.DATABASE_URI!.replace(
      /<password>/gi,
      process.env.DATABASE_PASSWORD!
    );
    await mongoose.connect(DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(
      `Database connection successful as of ${currentDate.toLocaleString()}`
    );
  } catch (err) {
    console.error("could not connect");
    process.exit(1);
  }
};

export default connectDB;
