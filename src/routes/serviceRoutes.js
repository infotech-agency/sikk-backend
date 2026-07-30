import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { uploadImage } from "../config/multer.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createServiceRules,
  updateServiceRules,
  idParamRule,
  paginationRules,
} from "../validators/serviceValidators.js";

const router = Router();

router
  .route("/")
  .post(
    uploadImage.single("image"),
    createServiceRules,
    validateRequest,
    createService
  )
  .get(paginationRules, validateRequest, getServices);

router
  .route("/:id")
  .get(getServiceById)
  .put(
    uploadImage.single("image"),
    // idParamRule,
    // updateServiceRules,

    updateService
  )
  .delete( deleteService);
// idParamRule, validateRequest,
export default router;
