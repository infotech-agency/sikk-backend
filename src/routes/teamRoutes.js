import { Router } from "express";
import {
 createTeam,
 getTeams,
 getTeamById,
 updateTeam,
 deleteTeam
} from "../controllers/teamController.js";

import { uploadImage } from "../config/multer.js";



const router = Router();


router.route("/")
.post(uploadImage.single("image"), createTeam)
.get(getTeams);


router.route("/:id")
.get(getTeamById)
.put(uploadImage.single("image"), updateTeam)
.delete(deleteTeam);


export default router;