import { Router } from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createJobRules,
  updateJobRules,
  idParamRule,
  paginationRules,
} from "../validators/jobValidators.js";

const router = Router();

router
  .route("/")
  .post(createJobRules, validateRequest, createJob)
  .get(paginationRules, validateRequest, getJobs);

router
  .route("/:id")
  .get(idParamRule, validateRequest, getJobById)
  .put( updateJob)
  // updateJobRules,
  .delete(deleteJob);

export default router;
