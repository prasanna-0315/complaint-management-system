import express from "express";
import connectDB from "./config/db.js";
import { createComplaint, getComplaints, getComplaintsByStudent, updateStatus } from "./controllers/complaintController.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.post("/complaint", createComplaint);
app.get("/complaint", getComplaints);
app.get("/complaint/student/:studentId", getComplaintsByStudent);
app.put("/complaint/:id", updateStatus);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
