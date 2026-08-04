import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const projectImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

// const projectSchema = new mongoose.Schema(
//   {
//     projectTitle: {
//       type: String,
//       required: [true, "Project title is required"],
//       trim: true,
//     },
//     projectImage: {
//       type: String,
//       default: "",
//     },
//     projectImagePublicId: {
//       type: String,
//       default: "",
//     },
//     location: {
//       type: String,
//       required: [true, "Location is required"],
//       trim: true,
//     },
//     clientName: {
//       type: String,
//       required: [true, "Client name is required"],
//       trim: true,
//     },
//     projectValue: {
//       type: String,
//       required: [true, "Project value is required"],
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: [true, "Category is required"],
//       enum: {
//         values: ["Infrastructure", "Government", "Industrial", "Residential", "Commercial"],
//         message:
//           "Category must be Infrastructure, Government, Industrial, Residential, or Commercial",
//       },
//     },
//     status: {
//       type: String,
//       required: [true, "Status is required"],
//       enum: {
//         values: ["Ongoing", "Completed"],
//         message: "Status must be Ongoing or Completed",
//       },
//     },
//     projectDescription: {
//       type: String,
//       required: [true, "Project description is required"],
//       trim: true,
//     },
//     projectImages: {
//       type: [projectImageSchema],
//       default: [],
//     },
//     featured: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    projectImage: {
      type: String,
      default: "",
    },
    projectImagePublicId: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    technicalFeatures: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Infrastructure", "Government", "Industrial", "Residential", "Commercial"],
        message:
          "Category must be Infrastructure, Government, Industrial, Residential, or Commercial",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Ongoing", "Completed"],
        message: "Status must be Ongoing or Completed",
      },
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    projectImages: {
      type: [projectImageSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.plugin(mongoosePaginate);


const Project = mongoose.model("Project", projectSchema);

export default Project;
