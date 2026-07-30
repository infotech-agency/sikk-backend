import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    keyCapabilities: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "keyCapabilities must be an array of non-empty strings",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

serviceSchema.plugin(mongoosePaginate);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
