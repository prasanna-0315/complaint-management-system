import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { createComplaint, getComplaints, getComplaintsByStudent, updateStatus } from "./controllers/complaintController.js";
import { registerUser, loginUser, changePassword } from "./controllers/userController.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files for admin and student
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use('/student', express.static(path.join(__dirname, '..', 'student')));
app.use('/', express.static(path.join(__dirname, '..')));

connectDB();

// Routes
app.post("/complaint", createComplaint);
app.get("/complaint", getComplaints);
app.get("/complaint/student/:studentId", getComplaintsByStudent);
app.put("/complaint/:id", updateStatus);

// User routes
app.post("/register", registerUser);
app.post("/login", loginUser);
app.put("/change-password", changePassword);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
