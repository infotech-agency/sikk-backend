import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse, PaginatedResponse } from "../utils/ApiResponse.js";
import {
  uploadToCloudinary,
  uploadManyToCloudinary,
  deleteFromCloudinary,
  deleteManyFromCloudinary,
  extractPublicIdFromUrl,
} from "../utils/cloudinaryHelpers.js";
import { buildPaginationQuery } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: CRUD for projects (single hero image + multiple gallery images)
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a project with hero image and multiple gallery images
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               projectTitle: { type: string }
 *               location: { type: string }
 *               clientName: { type: string }
 *               projectValue: { type: string }
 *               category: { type: string }
 *               status: { type: string }
 *               projectDescription: { type: string }
 *               featured: { type: boolean }
 *               projectImage: { type: string, format: binary }
 *               projectImages: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201: { description: Project created }
 */

// Add near top of file, after imports
const normalizeFeatures = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((f) => String(f).trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed.map((f) => String(f).trim()).filter(Boolean);
      }
    } catch {
      // not JSON, fall through to comma-split
    }
    return input.split(",").map((f) => f.trim()).filter(Boolean);
  }
  return [];
};


export const createProject = async (req, res, next) => {
  try {
    const {
      projectTitle,
      location,
      clientName,
      projectValue,
      category,
      status,
      projectDescription,
      featured,
    } = req.body;

    // Single hero image (field "projectImage")
    let projectImage = "";
    let projectImagePublicId = "";
    if (req.files?.projectImage?.[0]) {
      const hero = await uploadToCloudinary(req.files.projectImage[0], "projects/hero");
      projectImage = hero.url;
      projectImagePublicId = hero.public_id;
    }

    // Multiple gallery images (field "projectImages")
    let projectImages = [];
    if (req.files?.projectImages?.length) {
      projectImages = await uploadManyToCloudinary(
        req.files.projectImages,
        "projects/gallery"
      );
    }

    const project = await Project.create({
      projectTitle,
      location,
      clientName,
      // projectValue,
       technicalFeatures: normalizeFeatures(req.body.technicalFeatures),
      category,
      status,
      projectDescription,
      featured: featured === "true" || featured === true,
      projectImage,
      projectImagePublicId,
      projectImages,
    });

    return ApiResponse(res, 201, "Project created successfully", project);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get paginated list of projects (filter by status/category, search)
 *     tags: [Projects]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *       - { name: search, in: query, schema: { type: string } }
 *       - { name: status, in: query, schema: { type: string, enum: [Ongoing, Completed] } }
 *       - { name: category, in: query, schema: { type: string } }
 *       - { name: featured, in: query, schema: { type: boolean } }
 *     responses:
 *       200: { description: Paginated list of projects }
 */
export const getProjects = async (req, res, next) => {
  try {
    const { page, limit, sort, query } = buildPaginationQuery(req, [
      "projectTitle",
      "location",
      "clientName",
    ]);

    const result = await Project.paginate(query, {
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
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     responses:
 *       200: { description: Project details }
 *       404: { description: Not found }
 */
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, "Project not found");
    return ApiResponse(res, 200, "Project fetched successfully", project);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project. If new hero/gallery images are uploaded,
 *      old image assets are removed from Cloudinary and replaced.
 *     tags: [Projects]
 *     responses:
 *       200: { description: Project updated }
 *       404: { description: Not found }
 */
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, "Project not found");

    // Replace hero image
    if (req.files?.projectImage?.[0]) {
      const oldHero =
        project.projectImagePublicId ||
        extractPublicIdFromUrl(project.projectImage);
      if (oldHero) await deleteFromCloudinary(oldHero);
      const hero = await uploadToCloudinary(
        req.files.projectImage[0],
        "projects/hero"
      );
      project.projectImage = hero.url;
      project.projectImagePublicId = hero.public_id;
    }

    // Optionally append gallery images (any new uploads are ADDED, never auto-removed)
    if (req.files?.projectImages?.length) {
      const newImgs = await uploadManyToCloudinary(
        req.files.projectImages,
        "projects/gallery"
      );
      project.projectImages = [...project.projectImages, ...newImgs];
    }

    const updatable = [
      "projectTitle",
      "location",
      "clientName",
      // "projectValue",
      "category",
      "status",
      "projectDescription",
    ];
    for (const f of updatable) {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    }

    if (req.body.technicalFeatures !== undefined) {
      project.technicalFeatures = normalizeFeatures(req.body.technicalFeatures);
    }

    if (req.body.featured !== undefined) {
      project.featured = req.body.featured === "true" || req.body.featured === true;
    }

    await project.save();
    return ApiResponse(res, 200, "Project updated successfully", project);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project and remove ALL its Cloudinary image assets
 *     tags: [Projects]
 *     responses:
 *       200: { description: Project deleted }
 *       404: { description: Not found }
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, "Project not found");

    // Collect every public_id to delete (hero + all gallery images)
    const publicIds = [];
    const hero =
      project.projectImagePublicId ||
      extractPublicIdFromUrl(project.projectImage);
    if (hero) publicIds.push(hero);
    for (const img of project.projectImages) {
      if (img.public_id) publicIds.push(img.public_id);
    }
    await deleteManyFromCloudinary(publicIds);

    await project.deleteOne();
    return ApiResponse(res, 200, "Project deleted successfully", {
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
