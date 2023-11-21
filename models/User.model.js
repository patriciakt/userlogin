// models/User.model.js
const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          enum: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        },
      },
    ],
    videos: [
      {
        url: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          enum: ["video/mp4", "video/mpeg"],
        },
      },
    ],
    markers: [
      {
        user_id: {
          type: String,
          required: true,
        },
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
    posts: [postSchema], //array of blog entries
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
