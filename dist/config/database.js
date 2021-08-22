"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "src/config/config.env" });
const connectDB = async () => {
    try {
        const currentDate = new Date();
        const DB = process.env.DATABASE_URI.replace(/<password>/gi, process.env.DATABASE_PASSWORD);
        await mongoose_1.default.connect(DB, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log(`Database connection successful as of ${currentDate.toLocaleString()}`);
    }
    catch (err) {
        console.error("could not connect");
        process.exit(1);
    }
};
exports.default = connectDB;
