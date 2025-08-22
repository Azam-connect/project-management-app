# Project Management App

A full-stack CRUD app for managing projects, tasks, team collaboration, file attachments, comments, activity logs, and reporting.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Schemas](#schemas)
6. [API Endpoints](#api-endpoints)
7. [Setup & Installation](#setup--installation)
8. [Reporting](#reporting)
9. [File Upload (Attachments)](#file-upload-attachments)
10. [Activity Log](#activity-log)
11. [Further Improvements](#further-improvements)

---

## Overview

This application helps teams and individuals manage projects, assign tasks, add comments, upload attachments, track activity logs, receive notifications, and generate reports.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT (Access/Refresh tokens)
- **File Upload:** Multer
- **Validation:** Joi
- **Other:** Activity logs, notifications, report service

---

## Features

- User registration, login & JWT authentication
- Project creation, update, delete, and team management
- Task creation, assignment, status tracking (`todo`, `in-progress`, `testing`, `done`)
- File attachments for tasks (PDF, DOC/DOCX, images)
- Task comments/discussion
- Activity logs for audit/history
- Reporting: project/task stats, user stats, export as CSV

---

## Architecture

### High-Level Overview

The Project Management App follows a modular, service-oriented architecture with clear separation of frontend, backend, database, and file storage:

+---------------------+
|   React Frontend    |
+---------------------+
           │
           ▼
+---------------------+
| Node.js Express API |
+---------------------+
           │
           ▼
+-------------------------------+
| MongoDB (Mongoose Models)     |
+-------------------------------+
           │
           ▼
+-----------------------+
| File Storage (Local/Cloud) |
+-----------------------+

---

### Component Responsibilities

- **React Frontend:**  
  Provides user interface for login/signup, dashboard, project and task views, file uploads, comments, activity history, and notifications. All data is fetched and submitted via REST API calls.

- **Node.js Express Backend:**  
  Handles REST APIs, JWT authentication (access/refresh tokens), validation (with Joi), business logic (in service layers), file uploads (Multer), error handling, activity logging.

- **MongoDB (with Mongoose):**  
  Stores all persistent data—users, projects, tasks (with comments and attachments), activity logs, notifications.

- **File Storage:**  
  Stores all uploaded attachments, either locally (in `/uploads/tasks/`) or on cloud (e.g., AWS S3, Cloudinary). Attachment URLs are referenced in task documents and served statically by the API.

---

### Data Flow

1. **User actions** (e.g., create task, upload attachment, add comment) are initiated in frontend and sent to backend via HTTP REST API.
2. **Backend** validates requests (JWT & Joi), executes business logic, handles file uploads, persists changes to MongoDB, and logs activities or generates notifications when required.
3. **ActivityLog** entries are created automatically after relevant actions.
4. **Responses** flow back to frontend—UI updates for tasks, comments, files, and reports.

---

### Example: "Add Task with Attachment"

- User fills task form, selects files (attachments), and submits.
- React sends `POST /api/v1/tasks` (multipart/form-data) to backend.
- Express API validates, uses Multer to process and save files, updates database.
- File URLs stored as `attachments[]` array in Task document.
- Task is saved to MongoDB.
- ActivityLog entry created for "created task".
- UI updates on frontend.

---

### Security & Best Practices

- Passwords hashed with bcrypt.
- JWT (access/refresh tokens) secure all APIs.
- Only allowed file types and sizes are accepted.
- Sensitive APIs protected by middleware.
- Detailed logging for traceability and collaboration.

## Schemas

- **User:** name, email, password, createdAt
- **Project:** title, description, createdBy, teamMembers
- **Task:** projectId, title, description, assignedTo, deadline, status, attachments, comments
- **Comment:** user, message, timestamp (embedded in Task)
- **ActivityLog:** projectId, taskId, user, action, detail, timestamp

---

## API Endpoints

- `POST /api/register` — Register user
- `POST /api/login` — Login, returns access & refresh tokens
- `POST /api/projects` — Create project
- `GET /api/projects` — List user projects
- `PUT /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project
- `POST /api/tasks` — Create task (supports file upload)
- `PUT /api/tasks/:id` — Update task (optionally upload files)
- `GET /api/tasks/:projectId` — Get tasks by project
- `POST /api/tasks/:id/comment` — Add comment to task
- `POST /api/refresh-token` — Get new access token via refresh token
- `GET /api/activity/:projectId` — Get project activity log
- `GET /api/reports/progress/:projectId` — Project progress report
- `GET /api/reports/user/:userId` — User report
- `GET /api/reports/export/:projectId` — Export project tasks as CSV

---

## Setup & Installation

1. **Clone repo:**  
   `git clone <repo-url> && cd <repo-folder>`
2. **Install dependencies:**  
   `npm install`
3. **Configure environment:**  
   - Create `.env` file with MongoDB URL, JWT secrets, upload path, etc.
4. **Create Uploads Folder:**  
   - `uploads/tasks` for file attachments (if using local storage)
5. **Start Backend:**  
   `npm run dev`
6. **Start Frontend (optional):**  
   `cd client && npm start`
7. **API Testing:**  
   Use Postman.

---

## Reporting

- **Project Progress:** Task counts & completion percentage.
- **User Activity:** Task assignment & completion.
- **User Comparisons:** Task completions, overall activity.
- **Export:** Download CSV of all tasks for a project.

---

## File Upload (Attachments)

- Accepts PDFs, DOC/DOCX, images (`jpg`, `png`, `gif`, `webp`)
- Max 40 MB per file
- File URLs stored in task attachments array
- Express serves `/uploads/tasks/*` files statically

---

## Activity Log

- **Activity Log:** Every major action (create/update/comment) is logged for audit/history.

---

## Further Improvements

- Real-time notifications (Socket.io)
- Cloud uploads (AWS S3, Cloudinary)
- User roles/permissions
- Gantt charts or advanced reporting
- UI/UX enhancements & mobile responsive design

---
