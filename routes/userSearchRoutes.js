import { Router } from "express";
import { searchUsers } from "../controllers/userSearchController.js";


const router = Router();

router.get("/search", searchUsers);

export default router;
