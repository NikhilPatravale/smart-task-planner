import express from 'express';
import { LogIn, LogOut, SignUp } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", LogIn);
router.post("/logout", LogOut);

export default router;