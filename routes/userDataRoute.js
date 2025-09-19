import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
import { getUserData, postUserData } from "../controller/userData.js";

const router = express.Router();

router.get("/data/:username", authenticateUser, getUserData);
router.post("/data/:username", authenticateUser, postUserData);

export default router;
