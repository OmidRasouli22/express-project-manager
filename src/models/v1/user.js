const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
      default: null,
      maxLength: 100,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      default: null,
      maxLength: 100,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxLength: 255,
      trim: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      maxLength: 255,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    roles: {
      type: [
        {
          type: String,
        },
      ],
      required: false,
      default: ["USER"],
    },
    skills: [],
    teams: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
        },
      ],
      required: false,
      default: [],
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
