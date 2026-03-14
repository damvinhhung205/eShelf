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

export async function findAll(req, res, next) {
  let documents = [];
  try {
    const { name } = req.query;

    if (name) {
      documents = await userService.findByName(name);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving the list of users"),
    );
  }
}

export async function findOne(req, res, next) {
    try {
        const document = await userService.findById(req.params.id);

        if (!document) {
            return next(new ApiError(404, "User not found"));
        }

        return res.json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `An error occurred while retrieving the user with id=${req.params.id}`));
    }
}

export async function update(req, res, next) {
    try {
        if (Object.keys(req.body).length === 0) {
            return next(new ApiError(400, "Data to update cannot be empty"));
        }

        const document = await userService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "User not found"));
        }

        return res.json({ message: "User updated successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `An error occurred while updating the user with id=${req.params.id}`));
    }
}

export async function deleteOne(req, res, next) {
    try {
        const document = await userService.delete(req.params.id);

        if (!document) {
            return next(new ApiError(404, "User not found"));
        }

        return res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `An error occurred while deleting the user with id=${req.params.id}`));
    }
}

export async function deleteAll(req, res, next) {
    try {
        const deletedCount = await userService.deleteAll();

        return res.json({ message: `${deletedCount} users were deleted successfully` });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while deleting all users"));
    }
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return next(new ApiError(400, "Username or password cannot be empty"));
        }

        const user = await userService.findByUsername(username);
        if (!user) {
            return next(new ApiError(401, "Invalid username or password"));
        }

        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        if (!passwordIsCorrect) {
            return next(new ApiError(401, "Invalid username or password"));
        }

        // Generate JWT_SECRET later
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while logging in"));
    }
}

export default {
    create,
    findAll,
    findOne,
    update,
    deleteOne,
    deleteAll,
    login
};