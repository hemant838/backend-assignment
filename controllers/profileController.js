import User from "../models/User.js";
import bcrypt from "bcryptjs";
const { compare, genSalt, hash } = bcrypt;
import multer, { diskStorage } from "multer";

// Multer setup to file upload
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // limiting the size to 5mb
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Invalid file type. Only JPG, JPEG, and PNG are allowed."
                )
            );
        }
        cb(null, true);
    },
});

// Middleware for uploading profile picture
const uploadProfilePicture = upload.single("profilePicture");

export const viewProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const editProfile = async (req, res) => {
    const { name, email } = req.body;

    // input validation for email format
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ msg: "Invalid email format" });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.json({ msg: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res
            .status(400)
            .json({ msg: "Password must be at least 6 characters long" });
    }

    try {
        const user = await User.findById(req.user.userId);
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid current password" });
        }

        const salt = await genSalt(10);
        user.password = await hash(newPassword, salt);
        await user.save();

        res.json({ msg: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const uploadProfilePic = (req, res) => {
    uploadProfilePicture(req, res, async (err) => {
        if (err) {
            console.error(err);
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .json({ msg: "File size exceeds the 5MB limit." });
            }
            return res
                .status(400)
                .json({ msg: err.message || "Error uploading image" });
        }

        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        try {
            const filePath = req.file.path;

            // Update the user with new profile pic
            const user = await User.findByIdAndUpdate(
                req.user.userId,
                { profilePicture: filePath },
                { new: true }
            );

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error updating profile picture" });
        }
    });
};
