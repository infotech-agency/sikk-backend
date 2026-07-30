// import HeroVideo from "../models/heroVideo.js";

// // GET Hero Video
// export const getHeroVideo = async (req, res) => {
//   try {
//     let heroVideo = await HeroVideo.findOne();

//     if (!heroVideo) {
//       heroVideo = await HeroVideo.create({
//         video: "",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: heroVideo,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // UPDATE Hero Video
// export const updateHeroVideo = async (req, res) => {
//   try {
//     const { video } = req.body;

//     let heroVideo = await HeroVideo.findOne();

//     if (!heroVideo) {
//       heroVideo = await HeroVideo.create({
//         video,
//       });
//     } else {
//       heroVideo.video = video;
//       await heroVideo.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "Hero video updated successfully.",
//       data: heroVideo,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };,


import HeroVideo from "../models/HeroVideo.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryHelpers.js";

export const getHeroVideo = async (req, res, next) => {
  try {
    let heroVideo = await HeroVideo.findOne();

    if (!heroVideo) {
      heroVideo = await HeroVideo.create({
        video: "",
        publicId: "",
      });
    }

    return ApiResponse(res, 200, "Hero video fetched successfully", heroVideo);
  } catch (err) {
    next(err);
  }
};

export const updateHeroVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Video is required");
    }

    let heroVideo = await HeroVideo.findOne();

    // Delete old video
    if (heroVideo?.publicId) {
      await deleteFromCloudinary(heroVideo.publicId, "video");
    }

    // Upload new video
    const uploaded = await uploadToCloudinary(
      req.file,
      "hero-video",
      "video"
    );

    if (!heroVideo) {
      heroVideo = await HeroVideo.create({
        video: uploaded.url,
        publicId: uploaded.public_id,
      });
    } else {
      heroVideo.video = uploaded.url;
      heroVideo.publicId = uploaded.public_id;
      await heroVideo.save();
    }

    return ApiResponse(
      res,
      200,
      "Hero video updated successfully",
      heroVideo
    );
  } catch (err) {
    next(err);
  }
};

// export const updateHeroVideo = async (req, res, next) => {
    
//   try {
//     let heroVideo = await HeroVideo.findOne();

//     if (!heroVideo) {
//       heroVideo = await HeroVideo.create({
//         video: "",
//         publicId: "",
//       });
//     }

//     if (!req.file) {
//       throw new ApiError(400, "Video is required");
//     }

//     // Delete old video
//     if (heroVideo.publicId) {
//       await deleteFromCloudinary(heroVideo.publicId, "video");
//     }

//     // Upload new video
//     const uploaded = await uploadToCloudinary(
//       req.file,
//       "hero-video",
//       "video"
//     );

//     heroVideo.video = uploaded.url;
//     heroVideo.publicId = uploaded.public_id;

//     await heroVideo.save();

//     return ApiResponse(
//       res,
//       200,
//       "Hero video updated successfully",
//       heroVideo
//     );
//   } catch (err) {
//     next(err);
//   }
// };