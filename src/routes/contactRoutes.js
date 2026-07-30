import { Router } from "express";
import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} from "../controllers/contactController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createContactRules,
  idParamRule,
  paginationRules,
} from "../validators/contactValidators.js";

const router = Router();

router
  .route("/")
  .post(createContactRules, validateRequest, createContact)
  .get(paginationRules, validateRequest, getContacts);

router
  .route("/:id")
  .get(idParamRule, validateRequest, getContactById)
  .delete(idParamRule, validateRequest, deleteContact);

export default router;
