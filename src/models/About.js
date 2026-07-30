import mongoose from "mongoose";

/**
 * Single record collection for the About Us section. Enforced at the model
 * level via a unique key on `singleton` so only one row can ever exist.
 */
const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    mission: {
      type: String,
      required: [true, "Mission is required"],
      trim: true,
    },
    vision: {
      type: String,
      required: [true, "Vision is required"],
      trim: true,
    },
    values: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "values must be an array of non-empty strings",
      },
    },
    singleton: {
      type: String,
      default: "ABOUT",
      unique: true,
    },
  },
  {
    timestamps: true, // provides updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const About = mongoose.model("About", aboutSchema);

export default About;
