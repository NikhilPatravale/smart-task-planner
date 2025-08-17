import express from 'express';
import { authenticate } from '../middlewares/authentication.js';
import { UpdateUser } from '../controllers/user.js';

const router = express.Router();

router.post("/update", authenticate, UpdateUser);

export default router;