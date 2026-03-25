import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://complaint_management:Team%4003@cluster18.zes5ear.mongodb.net/");
    console.log("MongoDB ATLAS Connected");
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
