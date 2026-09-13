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

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    const existedUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const newUser = await User.create({
        fullname: fullname.trim(),
        email: normalizedEmail,
        password,
        username: normalizedUsername
    });

    const createUser = await User.findById(newUser._id).select("-password -refreshToken");

    return res.status(201).json(new ApiResponse(201, createUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, {
        user: {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    }, "User logged in successfully"));
});

export { registerUser, loginUser };