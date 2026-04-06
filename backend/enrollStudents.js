import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";

// Connect to database
await connectDB();

// List of students to add - UPDATE THIS LIST WITH YOUR STUDENTS
const studentsToAdd = [
  { studentId: "CS2021001", role: "student" },
  { studentId: "CS2021002", role: "student" },
  { studentId: "CS2021003", role: "student" },
  { studentId: "CS2021004", role: "student" },
  { studentId: "CS2021005", role: "student" },
  { studentId: "CS2021006", role: "student"},
  // Add more students as neededed
  // Format: { studentId: "ROLLNO", role: "student" }
];

// Add admin users
const adminsToAdd = [
  { studentId: "admin", password: "admin@123", role: "admin" },
  { studentId: "admin2", password: "admin@123", role: "admin" },
  { studentId: "admin3", password: "admin@123", role: "admin" }
];

async function addStudents() {
  try {
    console.log("Starting to add students and admin...\n");

    // Add admins
    for (const admin of adminsToAdd) {
      try {
        const existingAdmin = await User.findOne({ studentId: admin.studentId });
        if (existingAdmin) {
          console.log(`✓ Admin ${admin.studentId} already exists`);
        } else {
          const hashedPassword = await bcrypt.hash(admin.password, 10);
          await User.create({
            studentId: admin.studentId,
            password: hashedPassword,
            role: admin.role,
            firstLogin: false
          });
          console.log(`✓ Admin added - Username: ${admin.studentId} | Password: ${admin.password}`);
        }
      } catch (err) {
        console.log(`✗ Admin ${admin.studentId} - ${err.message}`);
      }
    }

    // Add students
    for (const student of studentsToAdd) {
      try {
        const existingUser = await User.findOne({ studentId: student.studentId });
        if (existingUser) {
          console.log(`✗ Student ${student.studentId} - Already exists`);
        } else {
          const hashedPassword = await bcrypt.hash(student.studentId, 10);
          await User.create({
            studentId: student.studentId,
            password: hashedPassword,
            role: student.role,
            firstLogin: true
          });
          console.log(` Student ${student.studentId} added - Default Password: ${student.studentId}`);
        }
      } catch (err) {
        console.log(` Student ${student.studentId} - ${err.message}`);
      }
    }

    console.log("\n Student enrollment completed!");
    console.log("\nIMPORTANT NOTES:");
    console.log("- Students with firstLogin=true must change their password on first login");
    console.log("- Admin user: admin / admin@123 (change password after first login)");
    
  } catch (error) {
    console.error("Error during enrollment:", error);
  } finally {
    process.exit(0);
  }
}

addStudents();
