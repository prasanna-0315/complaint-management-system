import User from "../models/user.js";
import bcrypt from "bcrypt";

// Register user (for students, with default password = studentId, or for admin)
export const registerUser = async (req, res) => {
  try {
    const { studentId, role = 'student', password = null } = req.body;
    
    // For students, default password is studentId; for admin, password must be provided
    let finalPassword = password;
    if (role === 'student' && !password) {
      finalPassword = studentId; // roll no as default password for students
    }
    
    if (!finalPassword) {
      return res.status(400).json({ message: "Password required for admin registration" });
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const user = await User.create({
      studentId,
      password: hashedPassword,
      role,
      firstLogin: role === 'student' ? true : false
    });

    res.json({ message: `User registered successfully. ${role === 'student' ? `Default password: ${studentId}` : ''}` });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "User already exists" });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      studentId: user.studentId,
      role: user.role,
      firstLogin: user.firstLogin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { studentId, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.firstLogin = false;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};