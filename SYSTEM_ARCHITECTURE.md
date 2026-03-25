# Complaint Management System - Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE (Browser)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐          ┌──────────────────────┐       │
│  │  STUDENT PORTAL      │          │   ADMIN PORTAL       │       │
│  ├──────────────────────┤          ├──────────────────────┤       │
│  │ • Login Page         │          │ • Login Page         │       │
│  │ • Dashboard          │          │ • Dashboard          │       │
│  │ • Raise Complaint    │          │ • Complaints List    │       │
│  │ • Track Status       │          │ • Manage Status      │       │
│  │ • Change Password    │          │ • View Statistics    │       │
│  └──────────────────────┘          └──────────────────────┘       │
│         (HTML/CSS/JS)                    (HTML/CSS/JS)             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 ▼
                        HTTP Requests/Responses
                        (JSON over CORS)
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SERVER SIDE (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Express.js API Routes                          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ POST   /login                  (Authentication)             │   │
│  │ POST   /register               (User Registration)          │   │
│  │ PUT    /change-password        (Password Management)        │   │
│  │ POST   /complaint              (Submit Complaint)           │   │
│  │ GET    /complaint              (Get All Complaints)         │   │
│  │ GET    /complaint/student/:id  (Get Student's Complaints)  │   │
│  │ PUT    /complaint/:id          (Update Complaint Status)    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                 ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │            Controllers (Business Logic)                     │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ • userController.js                                         │   │
│  │   - registerUser()                                          │   │
│  │   - loginUser()                                             │   │
│  │   - changePassword()                                        │   │
│  │                                                             │   │
│  │ • complaintController.js                                    │   │
│  │   - createComplaint()                                       │   │
│  │   - getComplaints()                                         │   │
│  │   - getComplaintsByStudent()                                │   │
│  │   - updateComplaintStatus()                                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                 ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │               Models (Data Structure)                       │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ • User Model                                                │   │
│  │   - studentId (unique)                                      │   │
│  │   - password (hashed)                                       │   │
│  │   - role (student/admin)                                    │   │
│  │   - firstLogin (boolean)                                    │   │
│  │                                                             │   │
│  │ • Complaint Model                                           │   │
│  │   - category (15 types)                                     │   │
│  │   - priority (Low/Medium/High/Critical)                     │   │
│  │   - status (Pending/In Progress/Resolved)                   │   │
│  │   - location, description                                   │   │
│  │   - timestamps                                              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                 ▼                                   │
└─────────────────────────────────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB Atlas)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Collections:                                                       │
│  • users        (User authentication & profiles)                    │
│  • complaints   (Complaint records)                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 👥 User Flow Diagram

### **Student Journey**

```
START
  │
  ├──► Student Login Page
  │    (Gradient Purple)
  │
  ├──► Verify Credentials
  │    (POST /login)
  │
  ├──► Check firstLogin Flag
  │
  ├──► IF firstLogin = true:
  │    │
  │    ├──► Show Password Change Modal
  │    │
  │    ├──► Verify Old Password
  │    │
  │    ├──► Update New Password
  │    │    (PUT /change-password)
  │    │
  │    ├──► Set firstLogin = false
  │    │
  │    └──► Success Message + Redirect
  │
  └──► Student Dashboard
       (Sidebar + Tabs)
       │
       ├──► TAB: Raise Complaint
       │    • Select Category (15 options with emojis)
       │    • Select Priority (Low/Medium/High/Critical)
       │    • Enter Location
       │    • Enter Description
       │    • Submit (POST /complaint)
       │    • Show Complaint ID + Success
       │
       ├──► TAB: Track Status
       │    • View "My Complaints" List
       │    • Color-coded Statuses:
       │    │  - Yellow: Pending
       │    │  - Blue: In Progress
       │    │  - Green: Resolved
       │    │
       │    └──► Search by Complaint ID
       │         (Show Details)
       │
       └──► Change Password (Sidebar)
            └──► Back to Dashboard

```

### **Admin Journey**

```
START
  │
  ├──► Admin Login Page
  │    (Gradient Dark Blue)
  │
  ├──► Verify Credentials
  │    (POST /login with role=admin)
  │
  └──► Admin Dashboard
       │
       ├──► View Statistics
       │    • Total Complaints (All)
       │    • Pending Complaints (⏳)
       │    • In Progress Complaints (🔄)
       │    • Resolved Complaints (✅)
       │    • Auto-refresh: Every 10 seconds
       │
       └──► Navigate to Complaints
            │
            └──► Complaints Management Page
                 │
                 ├──► View All Complaints
                 │    (NO student personal data shown)
                 │    Shows:
                 │    • Category
                 │    • Location
                 │    • Priority
                 │    • Status (editable)
                 │    • Date
                 │
                 ├──► Search Bar
                 │    (By category/location)
                 │
                 ├──► Status Filter
                 │    (Pending/In Progress/Resolved)
                 │
                 └──► Update Status
                      (Click dropdown → Select → PUT /complaint/:id)

```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│              USER PRESSES LOGIN                          │
└─────────────────────────────────────────────────────────┘
                       ▼
        ┌──────────────────────────────┐
        │ Validate Input               │
        │ (studentId, password)        │
        └──────────────────────────────┘
                       ▼ (Valid)
        ┌──────────────────────────────┐
        │ POST /login                  │
        │ {studentId, password}        │
        └──────────────────────────────┘
                       ▼
        ┌──────────────────────────────┐
        │ Find User in Database        │
        └──────────────────────────────┘
                       ▼
        ┌──────────────────────────────┐
        │ Bcrypt Compare Passwords     │
        ├──────────────────────────────┤
        │ Match? → Yes ✅              │
        │ Match? → No ❌               │
        └──────────────────────────────┘
                       ▼ (Match)
        ┌──────────────────────────────────────┐
        │ Return: {studentId, role,            │
        │          firstLogin: true/false}     │
        └──────────────────────────────────────┘
                       ▼
        ┌──────────────────────────────────────┐
        │ Store in sessionStorage:             │
        │ • studentId                          │
        │ • role (student/admin)               │
        │ • firstLogin (true/false)            │
        └──────────────────────────────────────┘
                       ▼
        ┌──────────────────────────────────────┐
        │ Client-side Check: firstLogin?       │
        ├──────────────────────────────────────┤
        │ TRUE  → Show Password Change Modal   │
        │ FALSE → Direct to Dashboard          │
        └──────────────────────────────────────┘
```

---

## 📤 Complaint Submission Flow

```
┌─────────────────────────────────────────────┐
│   STUDENT FILLS COMPLAINT FORM              │
├─────────────────────────────────────────────┤
│ • Category (dropdown)                       │
│ • Priority (Low/Medium/High/Critical)       │
│ • Location (text input)                     │
│ • Description (textarea)                    │
└─────────────────────────────────────────────┘
                   ▼
        ┌──────────────────────────┐
        │ Validate All Fields      │
        │ (Required checks)        │
        └──────────────────────────┘
                   ▼
        ┌──────────────────────────────────┐
        │ POST /complaint                  │
        │ {studentId, category, location,  │
        │  description, priority}          │
        └──────────────────────────────────┘
                   ▼
        ┌──────────────────────────────────┐
        │ Create Complaint Document        │
        │ • Set status = "Pending"         │
        │ • Add timestamps                 │
        │ • Generate _id (MongoDB)         │
        └──────────────────────────────────┘
                   ▼
        ┌──────────────────────────────────┐
        │ Save to Database                 │
        │ (complaints collection)          │
        └──────────────────────────────────┘
                   ▼
        ┌──────────────────────────────────┐
        │ Return Complaint _id             │
        │ to Client                        │
        └──────────────────────────────────┘
                   ▼
        ┌──────────────────────────────────┐
        │ Show Success Message             │
        │ "Complaint Submitted!"           │
        │ ID: [_id]                        │
        │ Status: Pending                  │
        └──────────────────────────────────┘
                   ▼
        ┌──────────────────────────────────┐
        │ Reset Form                       │
        │ (Clear all inputs)               │
        └──────────────────────────────────┘
```

---

## 🔄 Status Update Flow (Admin)

```
┌───────────────────────────────────────────────┐
│  ADMIN VIEWS COMPLAINT                        │
│  (Category, Location, Priority, Status)       │
├───────────────────────────────────────────────┤
│  Current Status Options:                      │
│  • ⏳ Pending                                  │
│  • 🔄 In Progress                             │
│  • ✅ Resolved                                │
└───────────────────────────────────────────────┘
               ▼
        ┌──────────────────────────┐
        │ Click Status Dropdown     │
        └──────────────────────────┘
               ▼
        ┌──────────────────────────┐
        │ Select New Status        │
        └──────────────────────────┘
               ▼
        ┌──────────────────────────────────┐
        │ PUT /complaint/:id               │
        │ {status: "In Progress"}          │
        └──────────────────────────────────┘
               ▼
        ┌──────────────────────────────────┐
        │ Update in Database               │
        │ • Set new status                 │
        │ • Update timestamp               │
        └──────────────────────────────────┘
               ▼
        ┌──────────────────────────────────┐
        │ Display Success Message          │
        │ "Status Updated"                 │
        │ New Status: In Progress 🔄       │
        └──────────────────────────────────┘
               ▼
        ┌──────────────────────────────────┐
        │ Update Card in UI                │
        │ Color changes:                   │
        │ Pending (Yellow)                 │
        │ → In Progress (Blue)             │
        └──────────────────────────────────┘
```

---

## 📊 Data Privacy Flow

```
┌─────────────────────────────────────────────────┐
│  COMPLAINT STORED IN DATABASE                   │
├─────────────────────────────────────────────────┤
│ {                                               │
│   _id: ObjectId,                                │
│   studentName: "CS2021001",        ◄─┐          │
│   studentId: "CS2021001",          ◄─┤ Private │
│   category: "Water & Sanitation",     │         │
│   location: "Block A",               │         │
│   priority: "High",                  │         │
│   status: "Pending",                 │         │
│   description: "..."                 │         │
│ }                                    ◄─┘       │
└─────────────────────────────────────────────────┘
               ▼
        ┌────────────┐      ┌────────────────┐
        │  Student   │      │     Admin      │
        │ Requests?  │      │   Requests?    │
        └────────────┘      └────────────────┘
          ▼                      ▼
    ┌──────────────┐      ┌──────────────────┐
    │ GET /complain│      │ GET /complaint   │
    │ /student/:id │      │ (all complaints) │
    └──────────────┘      └──────────────────┘
          ▼                      ▼
    Returns ALL fields      .select('-studentName
    (with studentName       -studentId')
    and studentId)          
                                 ▼
                          Returns WITHOUT:
                          • studentName
                          • studentId
                          (Privacy Protected)
```

---

## 🎯 Key Features & Status

| Feature | Type | Status | Details |
|---------|------|--------|---------|
| User Authentication | Security | ✅ Complete | Bcrypt hashing, session storage |
| First Login Password Change | Security | ✅ Complete | Modal popup, validation, forced |
| Role-based Access | Security | ✅ Complete | Student vs Admin routing |
| Student Dashboard | Feature | ✅ Complete | Sidebar nav, tabbed interface |
| Complaint Submission | Feature | ✅ Complete | 15 categories, priority levels |
| Complaint Tracking | Feature | ✅ Complete | Status colors, search by ID |
| Admin Dashboard | Feature | ✅ Complete | Stats, auto-refresh, quick actions |
| Complaint Management | Feature | ✅ Complete | Status updates, search, filter |
| Privacy Protection | Feature | ✅ Complete | No student data in admin view |
| Professional UI/UX | Design | ✅ Complete | Gradients, icons, animations |
| Responsive Layout | Design | ✅ Complete | Mobile and desktop support |
| Error Handling | Reliability | ✅ Complete | Frontend & backend validation |

---

## 🌐 Browser Access URLs

```
Local Environment (Port 5000):
├─ Student Portal
│  ├─ Login:     http://localhost:5000/student/student_login.html
│  └─ Dashboard: http://localhost:5000/student/student_dashboard.html
│
├─ Admin Portal
│  ├─ Login:     http://localhost:5000/admin/admin_login.html
│  ├─ Dashboard: http://localhost:5000/admin/admin_dashboard.html
│  └─ Complaints: http://localhost:5000/admin/complaints.html
│
└─ API Endpoints
   ├─ POST   http://localhost:5000/login
   ├─ POST   http://localhost:5000/register
   ├─ PUT    http://localhost:5000/change-password
   ├─ POST   http://localhost:5000/complaint
   ├─ GET    http://localhost:5000/complaint
   ├─ GET    http://localhost:5000/complaint/student/:id
   └─ PUT    http://localhost:5000/complaint/:id
```

---

## ✨ Summary

The **Complaint Management System** is a fully functional application with:

- **Secure Authentication**: Bcrypt hashing, role-based access, forced password changes
- **Complete Workflow**: Student complaint submission → Admin management → Status tracking
- **Professional Design**: Gradient backgrounds, modern icons, smooth animations
- **Privacy Protection**: No student personal data visible to admins
- **Responsive UI**: Works on desktop and mobile devices
- **Production Ready**: Comprehensive error handling and validation

**Status: 🚀 FULLY OPERATIONAL AND READY FOR USE**

