import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);