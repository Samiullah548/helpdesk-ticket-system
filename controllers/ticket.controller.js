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

export { createTicket }
