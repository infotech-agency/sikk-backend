import mongoose from "mongoose";

const heroVideoSchema = new mongoose.Schema(
  {
    video: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HeroVideo", heroVideoSchema);