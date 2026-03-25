# Complaint Management System - Updated Features & Setup Guide

## 🎉 Updates Made

### 1. **Authentication System**
- **Student Login**: Students now login with Roll Number (Student ID) and password
- **First Login Requirement**: Students must change their password on first login after registering
- **Admin Login**: Separate admin authentication with role-based access control
- **Password Hashing**: All passwords are encrypted using bcrypt for security

### 2. **Database Models**

#### User Model (New)
- `studentId`: Unique identifier (Roll Number)
- `password`: Hashed password
- `role`: 'student' or 'admin'
- `firstLogin`: Flag to force password change on first login

#### Complaint Model (Updated)
- New categories:
  - Water & Sanitation
  - Road & Infrastructure
  - Electricity & Power
  - Food & Mess
  - Hostel & Accommodation
  - Library & Resources
  - Transport & Vehicles
  - Academic & Curriculum
  - Faculty & Staff Conduct
  - Health & Medical
  - Safety & Security
  - IT & Technical
  - Sports & Recreation
  - Administrative Issues
  - Others

- New fields:
  - `priority`: Low, Medium, High, Critical
  - `assignedTo`: Track who handles the complaint
  - `resolution`: Resolution details

### 3. **Admin Dashboard Updates**
- **Hidden Student Data**: Admin view does NOT show student names or IDs for privacy
- **Only Complaint Data Visible**: Category, Description, Location, Status, Priority
- Ability to update complaint status and priority

### 4. **Frontend Updates**
- **Student Login**: Removed registration tab (admin adds students directly)
- **Password Change Modal**: Forces password change on first login
- **Updated Complaint Form**: New categories and priority selection
- **My Complaints Tracking**: Shows all student complaints with status
- **Admin Dashboard**: Statistics and complaint management

---

## 📋 How to Add Students

### Method 1: Using Enrollment Script (Recommended)

#### Step 1: Edit the enrollStudents.js file
Open `backend/enrollStudents.js` and update the students array:

```javascript
const studentsToAdd = [
  { studentId: "CS2021001", role: "student" },
  { studentId: "CS2021002", role: "student" },
  { studentId: "CS2021003", role: "student" },
  // Add more students as needed
  // Format: { studentId: "ROLLNO", role: "student" }
];
```

#### Step 2: Run the enrollment script
```bash
node backend/enrollStudents.js
```

#### Step 3: Check the output
You'll see confirmation messages for each student added:
```
✓ Student CS2021001 added - Default Password: CS2021001
```

### Method 2: Using API (For single students)

Make a POST request to `http://localhost:5000/register`:

```json
{
  "studentId": "CS2021004",
  "role": "student"
}
```

Default password will automatically be set to the studentId (Roll Number).

---

## 🔐 Login Credentials

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin@123`
- **Note**: Should change password after first login (future implementation)

### Sample Students (Added by enrollment script)
- **Student ID**: `CS2021001` | **Default Password**: `CS2021001`
- **Student ID**: `CS2021002` | **Default Password**: `CS2021002`
- **Student ID**: `CS2021003` | **Default Password**: `CS2021003`

---

## 🌐 URLs

### Student Portal
- **Login Page**: `http://localhost:5000/student/student_login.html`
- **Dashboard**: `http://localhost:5000/student/student_dashboard.html`

### Admin Portal
- **Login Page**: `http://localhost:5000/admin/admin_login.html`
- **Dashboard**: `http://localhost:5000/admin/admin_dashboard.html`
- **Complaints**: `http://localhost:5000/admin/complaints.html`

---

## 🔄 API Endpoints

### Authentication
- `POST /login` - Login (returns role, firstLogin status)
- `POST /register` - Register new user
- `PUT /change-password` - Change password

### Complaints
- `POST /complaint` - Create complaint
- `GET /complaint` - Get all complaints (admin only, no student data)
- `GET /complaint/student/:studentId` - Get student's complaints
- `PUT /complaint/:id` - Update complaint status

---

## 📝 Workflow

### For Students:
1. Login with Student ID (Roll Number) and default password
2. **On First Login**: Forced to change password before accessing dashboard
3. **Dashboard**: 
   - Raise complaints with new categories and priority
   - Track complaint status
   - View all their complaints

### For Admin:
1. Login with admin / admin@123
2. **Dashboard**: View statistics
3. **Complaints Page**: 
   - View all complaints (without student data)
   - Search by category or location
   - Update complaint status
   - Filter by status

---

## 🛠️ Additional Features

### Password Change on First Login
- Students must change their password immediately after first login
- New password must be different from roll number
- Minimum 6 characters required

### Complaint Visibility
- **Students**: Can only see their own complaints
- **Admin**: Can see all complaints WITHOUT student identification (privacy protected)
- Cannot search by student name in admin view

### Priority Levels
- Low
- Medium (default)
- High
- Critical

---

## ⚠️ Important Notes

1. **Server Status**: Make sure backend server is running on port 5000
2. **Database**: Ensure MongoDB Atlas is connected
3. **Password Reset**: Only admin can reset student passwords (future feature)
4. **Backup**: Create enrollment script backup before making changes

---

## 🚀 To Create More Students

Add them to `backend/enrollStudents.js`:

```javascript
const studentsToAdd = [
  { studentId: "CS2021001", role: "student" },
  { studentId: "CS2021002", role: "student" },
  { studentId: "CS2021003", role: "student" },
  { studentId: "CS2021004", role: "student" }, // New student
  { studentId: "CS2021005", role: "student" }, // New student
];
```

Then run the enrollment script again.

---

## 📞 Support

For any issues:
1. Check if MongoDB is connected
2. Ensure port 5000 is available
3. Check console for error messages
4. Verify API endpoints are responding

---

**Last Updated**: March 2026
