import Director from "../models/Director.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinaryHelpers.js";

// CREATE DIRECTOR
export const createDirector = async (req, res, next) => {
  try {
    const {
      name,
      designation,
      displayOrder,
      linkedInUrl,
      description,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file, "directors");
      imageUrl = uploaded.url;
    }

    const director = await Director.create({
      name,
      designation,
      displayOrder,
      linkedInUrl,
      description,
      imageUrl,
    });

    return ApiResponse(
      res,
      201,
      "Director created successfully",
      director
    );
  } catch (err) {
    next(err);
  }
};

// GET ALL DIRECTORS
export const getDirectors = async (req, res, next) => {
  try {
    const directors = await Director.find().sort({ createdAt: -1 });
    console.log(directors);
    return ApiResponse(
      res,
      200,
      "Directors fetched successfully",
      directors
    );
  } catch (err) {
    next(err);
  }
};

// GET SINGLE DIRECTOR
export const getDirectorById = async (req, res, next) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      throw new ApiError(404, "Director not found");
    }

    return ApiResponse(
      res,
      200,
      "Director fetched successfully",
      director
    );
  } catch (err) {
    next(err);
  }
};

// UPDATE DIRECTOR
export const updateDirector = async (req, res, next) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      throw new ApiError(404, "Director not found");
    }

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file, "directors");
      director.imageUrl = uploaded.url;
    }

    director.name = req.body.name ?? director.name;
    director.designation = req.body.designation ?? director.designation;
    director.displayOrder =
      req.body.displayOrder ?? director.displayOrder;
    director.linkedInUrl =
      req.body.linkedInUrl ?? director.linkedInUrl;
    director.description =
      req.body.description ?? director.description;

    await director.save();

    return ApiResponse(
      res,
      200,
      "Director updated successfully",
      director
    );
  } catch (err) {
    next(err);
  }
};

// DELETE DIRECTOR
export const deleteDirector = async (req, res, next) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      throw new ApiError(404, "Director not found");
    }

    await director.deleteOne();

    return ApiResponse(
      res,
      200,
      "Director deleted successfully",
      {
        id: req.params.id,
      }
    );
  } catch (err) {
    next(err);
  }
};

export default {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
};