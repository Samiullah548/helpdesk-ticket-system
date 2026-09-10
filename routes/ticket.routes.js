import express from "express";
import { createTicket, getMyTickets, getTicketById, updateTicket, deleteTicket } from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/mine", authMiddleware, getMyTickets);
router.get("/:id", authMiddleware, getTicketById);
router.put("/:id", authMiddleware, updateTicket);
router.delete("/:id", authMiddleware, deleteTicket)
router.put("/:id/status", authMiddleware,updateTicketStatus)

export default router;