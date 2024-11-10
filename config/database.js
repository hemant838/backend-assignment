import { connect } from "mongoose";

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;