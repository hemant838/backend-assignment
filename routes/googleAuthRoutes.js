import { Router } from "express";
import { authenticate } from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
    "/google",
    authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    authenticate("google", {
        failureRedirect: "/",
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { userId: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
        } catch (error) {
            res.status(500).send("Error generating token");
        }
    }
);

export default router;
