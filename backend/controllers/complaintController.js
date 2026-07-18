import Complaint from "../models/complaint.js";

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const { studentName, studentId, category, location, description } = req.body;

    // Calculate dynamic priority
    const existingCount = await Complaint.countDocuments({ category, location });
    const currentN = existingCount + 1;

    const topCounts = await Complaint.aggregate([
      { $group: { _id: { category: "$category", location: "$location" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 2 }
    ]);

    let maxCount = topCounts.length > 0 ? topCounts[0].count : 0;
    let secondMaxCount = topCounts.length > 1 ? topCounts[1].count : 0;

    if (currentN > maxCount) {
      secondMaxCount = maxCount;
      maxCount = currentN;
    } else if (currentN > secondMaxCount && currentN < maxCount) {
      secondMaxCount = currentN;
    }

    let calculatedPriority = 'Low';
    if (currentN >= maxCount && maxCount > 0) {
      calculatedPriority = 'Critical';
    } else if (currentN >= secondMaxCount && secondMaxCount > 0) {
      calculatedPriority = 'High';
    } else if (currentN >= 3) {
      calculatedPriority = 'Medium';
    }

    const complaint = await Complaint.create({
      studentName,
      studentId,
      category,
      location,
      description,
      priority: calculatedPriority
    });

    res.json(complaint);

  } catch (error) {
    console.error("createComplaint error:", error);
    res.status(500).json({ message: error?.message || "Error creating complaint" });
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


// Update complaint fields (admin)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const existingComplaint = await Complaint.findById(id);
    if (!existingComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const updates = {};

    if (status) {
      if (status === "Resolved") {
        if (existingComplaint.status === "Pending") {
          return res.status(400).json({ message: "Cannot transition directly from Pending to Resolved. Must be In Progress first." });
        }
        if (existingComplaint.status === "In Progress") {
          const inProgressTime = existingComplaint.inProgressAt || existingComplaint.updatedAt;
          const timeSince = new Date() - new Date(inProgressTime);
          if (timeSince < 120000) {
            return res.status(400).json({ message: "Must wait at least 2 minutes in 'In Progress' state before resolving." });
          }
        }
      } else if (status === "In Progress" && existingComplaint.status !== "In Progress") {
        updates.inProgressAt = new Date();
      }
    }

    if (typeof status === "string" && status.trim()) {
      updates.status = status;
    }
    if (typeof priority === "string" && priority.trim()) {
      updates.priority = priority;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updated = await Complaint.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};