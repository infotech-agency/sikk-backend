import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const careerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, "Please provide a valid phone number"],
    },
    positionAppliedFor: {
      type: String,
      required: [true, "Position applied for is required"],
      trim: true,
    },
    yearsOfExperience: {
      type: String,
      required: [true, "Years of experience is required"],
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    resumePublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

careerSchema.plugin(mongoosePaginate);

const Career = mongoose.model("Career", careerSchema);

export default Career;
