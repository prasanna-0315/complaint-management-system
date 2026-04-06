# Application Deployment Guide

Your Complaint Management System is fully ready for production! Since the backend Express application natively serves your HTML/CSS/JS frontend files, deploying the app is incredibly simple.

I highly recommend **[Render.com](https://render.com/)**, as it offers free hosting for Node.js web services and integrates seamlessly with GitHub.

Here is the exact step-by-step process:

---

## 🔒 1. Prepare Your Codebase
1. Ensure all your latest changes are committed.
2. Push your `ComplaintManagementSystem` repository to GitHub.
3. Verify that your MongoDB connection string in `backend/config/db.js` is securely pointing to your MongoDB Atlas cluster. (It successfully connects locally, so this is already good!)

---

## 🚀 2. Deploy on Render
1. Go to **Render.com** and sign up using your GitHub account.
2. In the Render Dashboard, click the **"New+"** button at the top and select **"Web Service"**.
3. Render will prompt you to connect a Git repository. Select your GitHub repository.
4. Fill in the build settings:
   - **Name**: `college-cms-app` (or whatever you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` 
   (*Note: I already mapped your `package.json` to properly trigger `node backend/server.js` on this command!*)

---

## ⚙️ 3. Environment Variables
On the final prep page on Render, expand the **"Advanced"** section and add the following Environment Variables.
- **PORT**: `10000` *(Render injects its own dynamic port by default, but adding this explicitly can improve the first-time startup process. I've already updated `server.js` to look for this variable dynamically.)*

---

## 🎉 4. Finalizing
1. Click **Deploy Web Service** at the bottom.
2. Render will spin up a small container, run `npm install`, and then launch your application.
3. Once the logs read `Server running on port...`, Render will give you a public `https://...` link near the top of the dashboard.
4. Click that link, and your app is officially live on the internet! 

Because I updated all frontend fetches to use "relative routing" rather than hardcoding `http://localhost`, your login tabs, complaint tools, and blueprints will dynamically communicate smoothly over the new live domain.
