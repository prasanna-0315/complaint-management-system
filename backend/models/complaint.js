import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    sparse: true
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
      'Water & Sanitation',
      'Road & Infrastructure',
      'Electricity & Power',
      'Food & Mess',
      'Hostel & Accommodation',
      'Library & Resources',
      'Transport & Vehicles',
      'Academic & Curriculum',
      'Faculty & Staff Conduct',
      'Health & Medical',
      'Safety & Security',
      'IT & Technical',
      'Sports & Recreation',
      'Administrative Issues',
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
  },
  inProgressAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  assignedTo: {
    type: String,
    default: null
  },
  resolution: {
    type: String,
    default: null
  }

}, { timestamps: true });

export default mongoose.model("Complaint", ComplaintSchema);
