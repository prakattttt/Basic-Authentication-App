import express from "express";
import { registerUser, loginUser, logoutUser, getToken } from "../controller/userAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token", getToken);
router.delete("/logout", logoutUser);

export default router;
