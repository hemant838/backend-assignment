import { Router } from "express";
import { authenticate } from "passport";
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
        const token = jwt.encode(
            { userId: req.user._id },
            process.env.JWT_SECRET
        );
        res.redirect(`/dashboard?token=${token}`);
    }
);

export default router;
