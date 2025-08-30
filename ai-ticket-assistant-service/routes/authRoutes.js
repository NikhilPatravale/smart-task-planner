import express from 'express';
import { LogIn, LogOut, Refresh, SignUp } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", LogIn);
router.get("/logout", LogOut);
router.get("/refresh", Refresh);

export default router;