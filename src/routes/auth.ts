import { Router } from "express";
import { login, register, me, logout } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/logout", auth, logout);

export default router;
