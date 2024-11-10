import User from "../models/User.js";

export const searchUsers = async (req, res) => {
    const { query } = req.query;
    const users = await User.find({
        name: { $regex: query, $options: "i" },
    }).select("name email");

    res.json(users);
};
