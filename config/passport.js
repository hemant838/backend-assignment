import { use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { findOne } from "../models/User.js";

use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/google/google/callback",
        },
        async (profile, done) => {
            try {
                let user = await findOne({ googleId: profile.id });
                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    });
                    await user.save();
                }
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
