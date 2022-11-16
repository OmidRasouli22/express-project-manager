const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inviteSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
    trim: true,
  },
  inviter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
  },
  requestDate: {
    type: Date,
    default: null,
    trim: true,
    required: false,
  },
  // 0 => pending
  // 1 => accepted
  // 2 => rejected
  status: {
    type: Number,
    default: 0,
  },
});

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
    avatar: {
      type: String,
      required: false,
      trim: true,
      default: null,
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
    inviteRequests: {
      type: [inviteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
