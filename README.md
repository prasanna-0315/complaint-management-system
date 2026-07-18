# Complaint Management System

A web-based **Complaint Management System** developed to simplify the process of registering, tracking, and managing complaints within an organization or institution. The system provides separate interfaces for students/users and administrators, ensuring efficient complaint handling and status tracking.

---

## Features

### Student Module
- User Registration and Login
- Raise New Complaints
- View Complaint History
- Track Complaint Status
- Change Password

### Admin Module
- Secure Admin Login
- View All Complaints
- Update Complaint Status
- Manage Complaint Records
- Monitor Complaint Progress

---

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Cloud Services
- Amazon EC2 (Application Hosting)
- Amazon S3 (File Storage)
- AWS IAM (Access Management)

### Other Tools
- Git & GitHub
- PM2
- MongoDB Atlas

---

## Project Structure

```
complaint-management-system/
│
├── admin/
├── student/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── assets/
├── package.json
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/complaint-management-system.git
cd complaint-management-system
```

### Install Dependencies

```bash
npm install
```

### Configure Database

Update the MongoDB connection string in:

```
backend/config/db.js
```

### Start the Application

```bash
npm start
```

The application will run on:

```
http://localhost:5000
```

---

## Deployment

The project is deployed using AWS services.

- Amazon EC2 – Hosts the Node.js application.
- Amazon S3 – Stores project assets and uploaded files.
- AWS IAM – Manages secure access and permissions.

PM2 is used as the process manager to keep the application running continuously.

---

## Future Enhancements

- Email Notifications
- File Upload Support
- Dashboard Analytics
- Role-Based Access Control
- Mobile Responsive UI
- AI-Based Complaint Categorization

---

## Advantages

- Easy complaint registration
- Faster complaint resolution
- Secure user authentication
- Centralized complaint management
- Cloud-based deployment
- User-friendly interface

---

## Team

**Project Title:** Complaint Management System

Developed as a Final Year Engineering Project using Web Technologies and AWS Cloud Services.

---

## License

This project is developed for academic and educational purposes.
