import mongoose, { Document, Schema, model } from "mongoose";

export interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  avatar: string;
  date?: Date;
  name?: string;
}

export interface ILike extends Document {
  user: mongoose.Schema.Types.ObjectId;
}

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  author: string;
  avatar: string;
  likes?: ILike[];
  comments?: IComment[];
  date: Date;
}

const postSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = model("Post", postSchema);
export default Post;
