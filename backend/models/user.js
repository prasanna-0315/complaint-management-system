import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  firstLogin: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);