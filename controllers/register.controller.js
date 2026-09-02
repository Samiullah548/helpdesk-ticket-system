import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, username } = req.body;

if (!fullname || !email || !password || !username) {
    throw new ApiError(400, "All fields are required");
}

const existedUser = await User.findOne(
    {
        $or: [{ email }, { username }]
    }
)

if (existedUser) {
    throw new ApiError(409, "User already exists")
}

const newUser = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase()
})

const createUser = await User.findById(newUser.id).select("-password -refreshToken")

return res.status(201).json(new ApiResponse(200, createUser, "User created successfully"));
})

export { registerUser }