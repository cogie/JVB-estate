import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

//create router
const router = express.Router();

router.get("/test", test);  
router.post("/update/:id", verifyToken, updateUser)

export default router;
