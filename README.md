# Complaint Management System

Student/Admin complaint tracking app with Node.js/Express backend, MongoDB, and static HTML/CSS/JS frontend.

## Run locally

1. Clone repo
   - `git clone https://github.com/<your-username>/<your-repo>.git`
2. Install dependencies
   - `npm install`
3. Set environment variable for MongoDB (or create `.env` file)
   - `MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/ComplaintDB?retryWrites=true&w=majority`
4. Start server
   - `npm start`
5. Open UI
   - Student: `student/student_login.html`
   - Admin: `admin/admin_login.html`

## Deployment to GitHub

1. Commit everything:
   - `git add .`
   - `git commit -m "Deploy-ready"
   - `git push origin main`
2. Use GitHub Pages (frontend only):
   - Settings → Pages → Source `main`/`root` or `/student`
   - Example URL: `https://<your-username>.github.io/<your-repo>/student_login.html`

> Backend cannot run on GitHub Pages. Use a Node host like Railway, Render, Heroku, or Fly.io.

## Deployment to Railway (recommended)

1. In Railway, create project from GitHub repo.
2. Set environment variables:
   - `MONGO_URI`
3. Set start command:
   - `npm start`
4. Deploy and note backend URL.
5. Update frontend API endpoints: in `student/student_dashboard.html` and `admin/admin_dashboard.html`, replace `http://localhost:5000` with deployed URL.

## Production configuration

- `.gitignore` already configured for node_modules and sensitive files.
- `package.json` uses:
   - `npm start` -> `node backend/server.js`
   - `npm run dev` -> `npx nodemon backend/server.js`

## Notes

- Make sure MongoDB Atlas user has read/write permission.
- Test login with existing seeded students/admins from `backend/enrollStudents.js`.
