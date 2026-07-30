import mongoose from "mongoose";

const directorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    linkedInUrl: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Director = mongoose.model("Director", directorSchema);

export default Director;