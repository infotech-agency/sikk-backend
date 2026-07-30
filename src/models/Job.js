import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const jobSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    employmentType: {
      type: String,
      required: [true, "Employment type is required"],
      enum: {
        values: ["Full Time", "Part Time", "Internship"],
        message: "Employment type must be Full Time, Part Time, or Internship",
      },
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [10, "Job description must be at least 10 characters"],
    },
    requirements: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "requirements must be an array of non-empty strings",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.plugin(mongoosePaginate);

const Job = mongoose.model("Job", jobSchema);

export default Job;
