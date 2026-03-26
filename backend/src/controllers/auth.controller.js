import ApiError from "../api-error.js";
import UserService from "../services/user.service.js";
import StaffService from "../services/staff.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userService = new UserService();
const staffService = new StaffService();

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return next(new ApiError(400, "Username or password cannot be empty"));
        }

        let account = null;
        let role = "";

        const user = await userService.findByUsername(username);
        if (user) {
            account = user;
            role = user.role;
        } else {
            const staff = await staffService.findByUsername(username);
            if (staff) {
                account = staff;
                role = staff.role;
            }
        }

        if (!account) {
            return next(new ApiError(401, "Invalid username or password"));
        }

        const passwordIsCorrect = await bcrypt.compare(password, account.password);
        if (!passwordIsCorrect) {
            return next(new ApiError(401, "Invalid username or password"));
        }

        const token = jwt.sign(
            { id: account._id, username: account.username, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "1h", }
        );

        return res.status(200).json({
            token,
            account: {
                _id: account._id,
                username: account.username,
                role: role,
            },
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while logging in"));
    }
}

export function googleCallback(req, res) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h", });

    res.redirect(`http://localhost:3001/api/books?token=${token}`);
}

export default { login, googleCallback };