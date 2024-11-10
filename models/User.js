import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";  
const { genSalt, hash } = bcrypt; 

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

// Hashing the password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); // Skip hashing if the password isn't modified
    }

    try {
        const salt = await genSalt(10);  
        this.password = await hash(this.password, salt);  
        next();  
    } catch (error) {
        next(error);  
    }
});

export default model("User", UserSchema);
