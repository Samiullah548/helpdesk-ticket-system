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

const loginUser = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(401, "User not found")
    }

    // await user.isPasswordCorrect(req.body.password)

    // if (isPasswordCorrect != true) {
    //     throw new ApiError(401, "Invalid password")
    // }

    const isPasswordValid = await user.isPasswordCorrect(req.body.password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    user.accessToken = jwt.sign({ id: user.$or({ email }, { username }) }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })

    user.refreshToken = jwt.sign({ id: user.$or({ email }, { username }) }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })


    res.send(200).json(new ApiResponse(200, { accessToken: user.accessToken, refreshToken: user.refreshToken }, "User logged in successfully"))
})

export { registerUser, loginUser }