import Complaint from "../models/complaint.js";

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const { studentName, studentId, category, location, description, priority = 'Medium' } = req.body;

    const complaint = await Complaint.create({
      studentName,
      studentId,
      category,
      location,
      description,
      priority
    });

    res.json(complaint);

  } catch (error) {
    res.status(500).json({ message: "Error creating complaint" });
  }
};


// Get all complaints (admin) - hide student data
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().select('-studentName -studentId');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get complaints for a specific student
export const getComplaintsByStudent = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.params.studentId });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update complaint status (admin)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};