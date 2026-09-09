import mongoose from 'mongoose';
import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const createTicket = asyncHandler(async (req, res) => {

    const { title, description, category, priority } = req.body;

    if (!title || !description || !category || !priority) {
        throw new ApiError(400, "All fields are required");
    }

    const newTicket = await Ticket.create({
        title, description, category, priority, createdBy: req.user.id,
        status: "Open"
    })

    return res.status(201).json(new ApiResponse(201, newTicket, "Ticket created successfully"));
})

const getMyTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, tickets, "Tickets retrieved successfully"));
})

const getTicketById = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }
    return res.status(200).json(new ApiResponse(200, ticket, "Ticket retrieved successfully"));
})

export {
    createTicket,
    getMyTickets,
    getTicketById
}
