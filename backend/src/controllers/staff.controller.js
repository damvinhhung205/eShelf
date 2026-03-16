import ApiError from '../api-error.js';
import StaffService from '../services/staff.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const staffService = new StaffService();
dotenv.config();

export async function create(req, res, next) {
    try {
        if (
            !req.body?.username ||
            !req.body?.password ||
            !req.body?.fullName
        ) {
            return next(new ApiError(400, "Username, password, and full name are required"));
        }
        
        const existingStaff = await staffService.findByUsername(req.body.username);
        if (existingStaff) {
            return next(new ApiError(409, "Username already exists"));
        }

        await staffService.create(req.body);

        res.status(201).json({ message: "Staff created successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while creating the staff"));
    }
}

export async function findAll(req, res, next) {
    let documents = [];
    try {
        const { name } = req.query;

        if (name) {
            documents = await staffService.findByName(name);
        } else {
            documents = await staffService.find({});
        }
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while retrieving the list of staff"));
    }
    res.json(documents);
}

export async function findOne(req, res, next) {
    try {
        const document = await staffService.findById(req.params.id);

        if (!document) {
            return next(new ApiError(404, "Staff not found"));
        }
        res.json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while retrieving the staff"));
    }
}

export async function update(req, res, next) {
    try {
        if (Object.keys(req.body).length === 0) {
            return next(new ApiError(400, "Data to update cannot be empty"));
        }

        const document = await staffService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Staff not found"));
        }

        return res.json({ message: "Staff updated successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `An error occurred while updating the staff with id=${req.params.id}`));
    }
}

export async function deleteOne(req, res, next) {
    try {
        const document = await staffService.delete(req.params.id);

        if (!document) {
            return next(new ApiError(404, "Staff not found"))
        }

        return res.json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `An error occurred while deleting the staff with id=${req.params.id}`));
    }
}

export async function deleteAll(req, res, next) {
    try {
        const deletedCount = await staffService.deleteAll();

        return res.json({ message: `${deletedCount} staff deleted successfully` });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while deleting all staff"));
    }
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return next(new ApiError(400, "Username and password are required"));
        }

        const staff = await staffService.findByUsername(username);
        if (!staff) {
            return next(new ApiError(404, "Staff not found"));
        }

        const passwordIsCorrect = await bcrypt.compare(password, staff.password);
        if (!passwordIsCorrect) {
            return next(new ApiError(401, "Invalid username or password"));
        }

        const token = jwt.sign({ id: staff._id, username: staff.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({
            token,
            staff: {
                id: staff._id,
                username: staff.username,
                role: staff.role,
            },
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while logging in"));
    }
}

export default {
    create, findAll, findOne, update, deleteOne, deleteAll, login
}