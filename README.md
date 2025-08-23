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
- **Other:** Activity logs, report service

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


```text
┌────────────────────┐
|   React Frontend   |
└─────────┬──────────┘
          |
          v   HTTP (REST API calls)
┌────────────────────────────┐
|     Node.js Express API    |
└─────────┬────────┬─────────┘
          |        |        
          v        v        
   Authentication  |
   Middleware      |
          |        |
          v        v
 ┌──────────────────────────────────────┐
 | MongoDB (Mongoose Models)            |
 | - User                               |
 | - Project                            |
 | - Task                               |
 | - ActivityLog                        |
 └──────────────────────────────────────┘
          |
          v
 ┌──────────────────────────────────────┐
 |   File Storage (Local/Cloud)         | 
 |   (e.g., uploads/tasks/ or S3)       |
 └──────────────────────────────────────┘

 ```
 ---

### Component Responsibilities

- **React Frontend:**  
  Provides user interface for login/signup, dashboard, project and task views, file uploads, comments, activity history. All data is fetched and submitted via REST API calls.

- **Node.js Express Backend:**  
  Handles REST APIs, JWT authentication (access/refresh tokens), validation (with Joi), business logic (in service layers), file uploads (Multer), error handling, activity logging.

- **MongoDB (with Mongoose):**  
  Stores all persistent data—users, projects, tasks (with comments and attachments), activity logs.

- **File Storage:**  
  Stores all uploaded attachments locally (in `/uploads/tasks/`). Attachment URLs are referenced in task documents and served statically by the API.

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

- **User:** name, email, password, role
- **Project:** title, description, createdBy, teamMembers
- **Task:** projectId, title, description, assignedTo, deadline, status, attachments, comments
- **Comment:** user, message, timestamp (embedded in Task)
- **ActivityLog:** projectId, projectTitle, taskId, user, action, detail, timestamp

---

## API Endpoints

- `POST /api/v1/user/register` — Register user
- `POST /api/v1/user/login` — Login, returns access & refresh tokens
- `POST /api/v1/user/refresh-token` — returns new access token via refresh token
- `GET /api/v1/user/profile-list` — returns user profile list
- `GET /api/v1/user/profile/:id?` — if id passesd then return selected profile details else self profile details
- `PUT /api/v1/user/profile/:id?` — if id passed then update selected profile details else self profile
- `POST /api/v1/project/create` — Create project
- `GET /api/v1/project/list` — List user projects
- `PUT /api/v1/project/update/:id` — Update project
- `DELETE /api/v1/project/delete/:id` — Delete project
- `GET /api/v1/project/user-projects/:id?` — returns assigned user's project list
- `GET /api/v1/project/detail/:id` — returns project details
- `POST /api/v1/task/add` — Create task (supports file upload)
- `PUT /api/v1/task/modify/:taskId` — Update task (optionally upload files)
- `GET /api/v1/task/list/:projectId` — Get tasks by project
- `GET /api/v1/task/detail/:taskId` — Get task details
- `POST /api/v1/task/add-comment/:taskId` — Add comment to task
- `DELETE /api/v1/task/purge/:taskId` — Delete task
- `GET /api/v1/report/project-report?projectId` — Get project's totalTasks, completedTasks, inProgressTasks, todoTasks, testingTasks
- `GET /api/v1/report/project-tasks-count/:userId?projectId` — Get user's totalTasks, completedTasks if projectId passed then project wise else overall
- `GET /api/v1/report/upcomming-tasks/:userId?daysAhead` —  Get tasks due soon (within next N days)
- `GET /api/v1/report/user-project-summary/:userId` — Get user's projects summary
- `GET /api/v1/report/user-daily-activity/:userId?startDate=&endDate=` — Get user's daily activity within date ranges
- `POST /api/v1/report/user-comparion-report` — Get user's activities to compare (pass userIds and projectId in body)
- `GET /api/v1/report/export-task-report?projectId` — Expor project tasks as CSV
- `GET /api/v1/report/activity?projectId=&userId` — Get project activity log

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
   Use Postman(Collection is attached in repo).

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
