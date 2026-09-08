import express from "express";
import { createTicket } from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/tickets", authMiddleware, createTicket);

export const ticketRouter = router;
export default router;