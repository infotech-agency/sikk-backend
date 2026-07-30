import Career from "../models/Career.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse, PaginatedResponse } from "../utils/ApiResponse.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryHelpers.js";
import { buildPaginationQuery } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Careers
 *   description: Career applications (resume upload)
 */

/**
 * @swagger
 * /api/careers/apply:
 *   post:
 *     summary: Submit a new job application with resume (PDF/DOC/DOCX)
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               phoneNumber: { type: string }
 *               positionAppliedFor: { type: string }
 *               yearsOfExperience: { type: string }
 *               coverLetter: { type: string }
 *               resume: { type: string, format: binary }
 *     responses:
 *       201: { description: Application submitted }
 */
export const applyCareer = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      positionAppliedFor,
      yearsOfExperience,
      coverLetter,
    } = req.body;

    if (!req.file) {
      throw new ApiError(400, "Resume file is required (PDF, DOC, or DOCX, max 5 MB)");
    }

    // Upload resume as a "raw" resource type so Cloudinary preserves the file format
    const uploaded = await uploadToCloudinary(req.file, "careers/resumes", "raw");
    const resumeUrl = uploaded.url;
    const resumePublicId = uploaded.public_id;

    const career = await Career.create({
      fullName,
      email,
      phoneNumber,
      positionAppliedFor,
      yearsOfExperience,
      coverLetter,
      resumeUrl,
      resumePublicId,
    });

    return ApiResponse(res, 201, "Application submitted successfully", career);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/careers:
 *   get:
 *     summary: Get paginated list of career applications (search)
 *     tags: [Careers]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *       - { name: search, in: query, schema: { type: string } }
 *     responses:
 *       200: { description: Paginated list of applications }
 */
export const getCareers = async (req, res, next) => {
  try {
    const { page, limit, sort, query } = buildPaginationQuery(req, [
      "fullName",
      "email",
      "positionAppliedFor",
    ]);

    const result = await Career.paginate(query, {
      page,
      limit,
      sort,
      select: "-__v",
    });

    return PaginatedResponse(res, {
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
      data: result.docs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/careers/{id}:
 *   get:
 *     summary: Get an application by ID
 *     tags: [Careers]
 *     responses:
 *       200: { description: Application details }
 *       404: { description: Not found }
 */
export const getCareerById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    console.log("career", career);
    if (!career) throw new ApiError(404, "Application not found");
    return ApiResponse(res, 200, "Application fetched successfully", career);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/careers/{id}:
 *   delete:
 *     summary: Delete an application AND its resume from Cloudinary
 *     tags: [Careers]
 *     responses:
 *       200: { description: Application deleted }
 *       404: { description: Not found }
 */
export const deleteCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) throw new ApiError(404, "Application not found");

    if (career.resumePublicId) {
      // Resume is stored as "raw" resource type on Cloudinary
      await deleteFromCloudinary(career.resumePublicId, "raw");
    }

    await career.deleteOne();
    return ApiResponse(res, 200, "Application deleted successfully", {
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

export default { applyCareer, getCareers, getCareerById, deleteCareer };
