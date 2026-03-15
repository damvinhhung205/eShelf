import ApiError from "../api-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function auth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Invalid token"));
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token expired");
      return next(new ApiError(401, "Token Expired"));
    }
    
    if (error.name === "JsonWebTokenError") {
            return next(new ApiError(401, "Invalid token format or signature"));
    }

    console.error(error);
    return next(new ApiError(500, "Internal server error during authentication"));
  }
}

export default auth;