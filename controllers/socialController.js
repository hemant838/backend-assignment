import User from "../models/User.js";


export const followUser = async (req, res) => {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.userId);

    if (currentUser.following.includes(targetUser._id)) {
        return res.status(400).json({ msg: "Already following this user" });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.json({ msg: "Followed user successfully" });
};


export const unfollowUser = async (req, res) => {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.userId);

    currentUser.following = currentUser.following.filter(
        (followId) => followId.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
        (followerId) => followerId.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ msg: "Unfollowed user successfully" });
};


export const getFollowersFollowing = async (req, res) => {
    const user = await findById(req.user.userId).populate(
        "followers following",
        "name email"
    );
    res.json({ followers: user.followers, following: user.following });
};
