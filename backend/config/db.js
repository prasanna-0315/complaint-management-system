import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://complaint_management:Team%4003@cluster18.zes5ear.mongodb.net/");
    console.log("MongoDB ATLAS Connected");

    // Repair legacy unique index on complaintId that blocks inserts when field is missing.
    // Safe to ignore if index is already absent.
    try {
      await mongoose.connection.collection("complaints").dropIndex("complaintId_1");
      console.log("Dropped legacy complaints.complaintId_1 index");
    } catch (indexError) {
      if (indexError?.codeName !== "IndexNotFound") {
        console.warn("Index repair skipped:", indexError.message);
      }
    }
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
