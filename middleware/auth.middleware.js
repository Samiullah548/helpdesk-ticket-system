import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js"; // Make sure to import the User model

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password -refreshToken");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }
})