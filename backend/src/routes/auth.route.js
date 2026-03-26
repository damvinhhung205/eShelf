import express from "express";
import authController from "../controllers/auth.controller.js";
import passport from '../middlewares/passport.middleware.js';

const router = express.Router();

router.post("/login", authController.login);

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get("/google/callback",
            passport.authenticate('google', { failureRedirect: "/", session: false}),
            authController.googleCallback);


export default router;