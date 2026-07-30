import Image from "../models/Image.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelpers.js";

export const uploadImageController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const uploaded = await uploadToCloudinary(req.file, "images");

    const image = await Image.create({
      image: uploaded.url,
      public_id: uploaded.public_id,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (err) {
    next(err);
  }
};

export const getImages = async (req, res, next) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await deleteFromCloudinary(image.public_id);

    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};