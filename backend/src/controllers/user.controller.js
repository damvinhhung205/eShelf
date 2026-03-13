import ApiError from "../api-error.js";
import UserService from "../services/user.service.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const userService = new UserService();
dotenv.config();

export async function create(req, res, next) {
    try {
        if (!req.body?.username || !req.body?.password || !req.body?.firstName || !req.body?.lastName) {
            return next(new ApiError(400, "Username, password, first name, and last name are required"));
        }

        const existingUser = await userService.findByUsername(req.body.username);
        if (existingUser) {
            return next(new ApiError(409, "Username already exists"));
        }

        await userService.create(req.body);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while registering the user"));
    }

    
}

export default {
    create
};