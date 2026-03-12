import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  complaintId: {
  type: String,
  unique: true
},
  studentName: {
    type: String,
    required: true
  },
studentId: {
  type: String
},
  category: {
    type: String,
enum: [
  'Water',
  'Road',
  'Electricity',
  'Food',
  'Hostel',
  'Library',
  'Transport',
  'Others'
],
    required: true
  },

  description: {
    type: String,
    required: true
  },
  location: {
  type: String,
  required: true
},
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  }

}, { timestamps: true });

export default mongoose.model("Complaint", ComplaintSchema);
