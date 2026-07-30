import Service from "../models/Service.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse, PaginatedResponse } from "../utils/ApiResponse.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
} from "../utils/cloudinaryHelpers.js";
import { buildPaginationQuery } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: CRUD for company services
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               image: { type: string, format: binary }
 *               keyCapabilities: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Service created }
 */
export const createService = async (req, res, next) => {
  try {
    const { title, description, keyCapabilities } = req.body;

    let image = "";
    let imagePublicId = "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file, "services");
      image = uploaded.url;
      imagePublicId = uploaded.public_id;
    }

    const service = await Service.create({
      title,
      description,
      keyCapabilities,
      image,
      imagePublicId,
    });

    return ApiResponse(res, 201, "Service created successfully", service);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get paginated list of services
 *     tags: [Services]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, default: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, default: 10 } }
 *       - { name: search, in: query, schema: { type: string } }
 *     responses:
 *       200: { description: Paginated list of services }
 */
export const getServices = async (req, res, next) => {
  try {
    const { page, limit, sort, query } = buildPaginationQuery(req, [
      "title",
      "description",
    ]);

    const result = await Service.paginate(query, {
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
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     responses:
 *       200: { description: Service details }
 *       404: { description: Not found }
 */
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new ApiError(404, "Service not found");
    return ApiResponse(res, 200, "Service fetched successfully", service);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service (replaces image if a new one is uploaded)
 *     tags: [Services]
 *     responses:
 *       200: { description: Service updated }
 *       404: { description: Not found }
 */
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new ApiError(404, "Service not found");

    const { title, description, keyCapabilities } = req.body;

    // Replace image on Cloudinary if a new one is uploaded
    if (req.file) {
      // delete old asset from Cloudinary (prefer stored public_id, otherwise derive from URL)
      const oldPublicId = service.imagePublicId || extractPublicIdFromUrl(service.image);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      const uploaded = await uploadToCloudinary(req.file, "services");
      service.image = uploaded.url;
      service.imagePublicId = uploaded.public_id;
    }

    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (keyCapabilities !== undefined) service.keyCapabilities = keyCapabilities;

    await service.save();
    return ApiResponse(res, 200, "Service updated successfully", service);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service and its Cloudinary image
 *     tags: [Services]
 *     responses:
 *       200: { description: Service deleted }
 *       404: { description: Not found }
 */
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new ApiError(404, "Service not found");

    const publicId = service.imagePublicId || extractPublicIdFromUrl(service.image);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    await service.deleteOne();
    return ApiResponse(res, 200, "Service deleted successfully", { id: req.params.id });
  } catch (err) {
    next(err);
  }
};

export default {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
