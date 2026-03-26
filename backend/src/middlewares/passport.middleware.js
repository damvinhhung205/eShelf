//npm install passport passport-google-oauth20

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "../services/user.service.js";
import dotenv from "dotenv";

dotenv.config();
const userService = new UserService();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;

            let user = await userService.findByUsername(email);

            if (!user) {
                user = await userService.create({
                    username: email,
                    password: "oauth_placeholder_password",
                    firstName: firstName,
                    lastName: lastName,
                    role: "user"
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

export default passport;