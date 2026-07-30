import Service from "../models/Service.js";
import Project from "../models/Project.js";
import Job from "../models/Job.js";
import Career from "../models/Career.js";
import Contact from "../models/Contact.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (counts of all entities)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalServices: { type: integer }
 *                     totalProjects: { type: integer }
 *                     totalJobs: { type: integer }
 *                     totalApplications: { type: integer }
 *                     totalContacts: { type: integer }
 *                     completedProjects: { type: integer }
 *                     ongoingProjects: { type: integer }
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalServices,
      totalProjects,
      totalJobs,
      totalApplications,
      totalContacts,
      completedProjects,
      ongoingProjects,
    ] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      Job.countDocuments(),
      Career.countDocuments(),
      Contact.countDocuments(),
      Project.countDocuments({ status: "Completed" }),
      Project.countDocuments({ status: "Ongoing" }),
    ]);

    const data = {
      totalServices,
      totalProjects,
      totalJobs,
      totalApplications,
      totalContacts,
      completedProjects,
      ongoingProjects,
    };

    return ApiResponse(res, 200, "Dashboard statistics", data);
  } catch (err) {
    next(err);
  }
};

export default { getDashboardStats };
