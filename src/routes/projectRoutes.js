import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { uploadImages } from "../config/multer.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createProjectRules,
  updateProjectRules,
  idParamRule,
  paginationRules,
} from "../validators/projectValidators.js";

const router = Router();

/**
 * Field names follow the spec exactly:
 *   projectImage  -> single hero image
 *   projectImages -> multiple gallery images
 */
router
  .route("/")
  .post(
    uploadImages.fields([
      { name: "projectImage", maxCount: 1 },
      { name: "projectImages", maxCount: 10 },
    ]),
    // uploadImages.single("images[]"),
    createProjectRules,
    validateRequest,
    createProject
  )
  .get(paginationRules, validateRequest, getProjects);
// router.post(
//   "/",
//   uploadImages.single("images[]"),
//   (req, res, next) => {
//     console.log("BODY =>", req.body);
//     console.log("FILE =>", req.file);
//     next();
//   },
//   createProjectRules,
//   validateRequest,
//   createProject
// );
router
  .route("/:id")
  .get(idParamRule, validateRequest, getProjectById)
  .put(
    uploadImages.fields([
      { name: "projectImage", maxCount: 1 },
      { name: "projectImages", maxCount: 10 },
    ]),
    // idParamRule,
    updateProjectRules,
    // validateRequest,
    updateProject
  )
  .delete(deleteProject);

export default router;
