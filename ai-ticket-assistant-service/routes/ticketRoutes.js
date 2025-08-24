import express from 'express';
import { authenticate } from '../middlewares/authentication.js';
import { CreateTicket, GetTicket, GetTickets } from '../controllers/ticket.js';

const router = express.Router();

router.post("/", authenticate, CreateTicket);
router.get("/", authenticate, GetTickets);
router.get("/:id", authenticate, GetTicket);

export default router;