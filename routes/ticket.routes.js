import express from "express";
import { createTicket, getMyTickets, getTicketById } from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/mine", authMiddleware, getMyTickets);
router.get("/:id", authMiddleware, getTicketById);

export default router;