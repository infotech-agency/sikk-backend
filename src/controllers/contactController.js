import Contact from "../models/Contact.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse, PaginatedResponse } from "../utils/ApiResponse.js";
import { buildPaginationQuery } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form submissions
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form inquiry
 *     tags: [Contact]
 *     responses:
 *       201: { description: Inquiry submitted }
 */
export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    return ApiResponse(res, 201, "Inquiry submitted successfully", contact);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get paginated list of contact inquiries (search)
 *     tags: [Contact]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *       - { name: search, in: query, schema: { type: string } }
 *     responses:
 *       200: { description: Paginated list of inquiries }
 */
export const getContacts = async (req, res, next) => {
  try {
    const { page, limit, sort, query } = buildPaginationQuery(req, [
      "name",
      "email",
      "subject",
    ]);

    const result = await Contact.paginate(query, {
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
 * /api/contact/{id}:
 *   get:
 *     summary: Get a contact inquiry by ID
 *     tags: [Contact]
 *     responses:
 *       200: { description: Inquiry details }
 *       404: { description: Not found }
 */
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) throw new ApiError(404, "Inquiry not found");
    return ApiResponse(res, 200, "Inquiry fetched successfully", contact);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Delete a contact inquiry
 *     tags: [Contact]
 *     responses:
 *       200: { description: Inquiry deleted }
 *       404: { description: Not found }
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) throw new ApiError(404, "Inquiry not found");
    return ApiResponse(res, 200, "Inquiry deleted successfully", {
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

export default { createContact, getContacts, getContactById, deleteContact };
