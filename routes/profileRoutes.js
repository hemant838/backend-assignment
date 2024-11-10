import { Router } from "express";
import {
    viewProfile,
    editProfile,
    changePassword,
    uploadProfilePic,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", authMiddleware, viewProfile);

router.put("/profile", authMiddleware, editProfile);
router.put("/profile/password", authMiddleware, changePassword);

router.post("/profile/upload", authMiddleware, uploadProfilePic);

export default router;
