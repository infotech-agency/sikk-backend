import Job from "../models/Job.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse, PaginatedResponse } from "../utils/ApiResponse.js";
import { buildPaginationQuery } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: CRUD for job postings
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a job posting
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               designation: { type: string }
 *               jobTitle: { type: string }
 *               location: { type: string }
 *               employmentType: { type: string, enum: [Full Time, Part Time, Internship] }
 *               jobDescription: { type: string }
 *               requirements: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Job created }
 */
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    return ApiResponse(res, 201, "Job created successfully", job);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get paginated list of jobs (filter by employmentType, search)
 *     tags: [Jobs]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *       - { name: search, in: query, schema: { type: string } }
 *       - { name: employmentType, in: query, schema: { type: string, enum: [Full Time, Part Time, Internship] } }
 *     responses:
 *       200: { description: Paginated list of jobs }
 */
export const getJobs = async (req, res, next) => {
  try {
    const { page, limit, sort, query } = buildPaginationQuery(req, [
      "designation",
      "jobTitle",
      "location",
    ]);

    const result = await Job.paginate(query, {
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
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     responses:
 *       200: { description: Job details }
 *       404: { description: Not found }
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw new ApiError(404, "Job not found");
    return ApiResponse(res, 200, "Job fetched successfully", job);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job posting
 *     tags: [Jobs]
 *     responses:
 *       200: { description: Job updated }
 *       404: { description: Not found }
 */
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!job) throw new ApiError(404, "Job not found");
    return ApiResponse(res, 200, "Job updated successfully", job);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job posting
 *     tags: [Jobs]
 *     responses:
 *       200: { description: Job deleted }
 *       404: { description: Not found }
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) throw new ApiError(404, "Job not found");
    return ApiResponse(res, 200, "Job deleted successfully", { id: req.params.id });
  } catch (err) {
    next(err);
  }
};

export default { createJob, getJobs, getJobById, updateJob, deleteJob };
