import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Database Connected");

    } catch (error) {
        console.error("Connection Failed with the database");
    }
}