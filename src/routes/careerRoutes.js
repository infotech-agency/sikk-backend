import { Router } from "express";
import {
  applyCareer,
  getCareers,
  getCareerById,
  deleteCareer,
} from "../controllers/careerController.js";
import { uploadResume } from "../config/multer.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  applyCareerRules,
  idParamRule,
  paginationRules,
} from "../validators/careerValidators.js";

const router = Router();

router
  .route("/apply")
  .post(uploadResume.single("resume"), applyCareerRules, validateRequest, applyCareer);

router
  .route("/")
  .get(paginationRules, validateRequest, getCareers);

router
  .route("/:id")
  .get(getCareerById)
  .delete( deleteCareer);
// idParamRule, validateRequest,
export default router;
