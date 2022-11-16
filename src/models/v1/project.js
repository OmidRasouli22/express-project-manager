const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 255,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: false,
      default: null,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [
        {
          type: String,
        },
      ],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
