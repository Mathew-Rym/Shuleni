Shuleni deployed link: (https://shuleni-1-73c5.onrender.com)

Shuleni Backend

Shuleni is a full-stack online school system designed to manage school operations efficiently. This is the **backend** of the application, built with **Flask**, **PostgreSQL**, and **SQLAlchemy**, and secured using **JWT Authentication**.

Rendeer backend deployment: https://dashboard.render.com/web/srv-d1srfler433s73elmshg
Postgres database dashboard: https://dashboard.render.com/d/dpg-d23bd8u3jp1c739odisg-a

🔧 Tech Stack

- **Framework**: Flask
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Pytest + Factory Boy
- **Deployment**: Render

🗂️ Project Structure

shuleni-backend/
├── app/
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── utils/
│ └── ...
├── migrations/
├── tests/
│ ├── factories/
│ └── ...
├── seed.py
├── config.py
├── run.py
├── requirements.txt
└── README.md

markdown
Copy
Edit

---

🔐 Authentication & Authorization

- JWT-based login system
- Token refresh endpoint
- Role-based access control (admin, educator, student)
- School-level access control for multi-tenancy

Core Features (Modules)

### 1. **Authentication**
- `POST /register/school`: Register a new school and admin user
- `POST /login`: Login and receive access/refresh tokens
- `POST /refresh`: Refresh an expired access token

### 2. **School Management**
- Manage schools and associated users
- Enforce isolation between school data

### 3. **User Management**
- Register students and educators
- Password hashing and JWT token issuance
- Role-based data access and route protection

### 4. **Classroom & Enrollment**
- CRUD operations for classes
- Enroll users to classes via `/api/enrollments`
- Relationship enforcement per school

### 5. **Subjects & ClassSubjects**
- Create subjects (`/api/subjects`)
- Assign subjects to classes (`/api/class_subjects`)

### 6. **Resources**
- Upload resources per class
- Store title, description, and file URL
- Viewable by enrolled users

### 7. **Attendance Tracking**
- Educators record attendance per student per class
- `/api/attendance` for create, update, and view

### 8. **Exams & Submissions**
- Schedule exams with time limits
- Students submit work via `/api/exam_submissions`
- Scores and plagiarism flag tracking

### 9. **Assignments**
- Educators create assignments per class
- Students submit assignments
- Teachers review submissions

### 10. **Chat System**
- Students and educators communicate within class chats

### 11. **Announcements**
- Admins and educators can post updates to classes

Database Schema Overview

Includes all primary and relational models:
- `schools`, `users`, `classes`
- `subjects`, `class_subjects`, `enrollments`
- `resources`, `attendance`, `exams`, `exam_submissions`
- `assignments`, `assignment_submissions`
- `chats`, `video_sessions`, `clubs`, `club_members`, `announcements`

Seeding

Run `seed.py` to generate sample data across all models for development/testing:

```bash
python seed.py
🧪 Testing
Unit and integration tests using pytest

Factories for generating model instances

Tests for:

Auth logic

Role & school-based route protection

CRUD operations

Relationships and edge cases

Run tests:

bash
Copy
Edit
pytest
🔄 API Design
RESTful endpoints organized under /api:

Example:

http
Copy
Edit
GET /api/classes
POST /api/resources
DELETE /api/attendance/<id>
🚀 Deployment
Backend: Deployed to Render with auto-deploy from main

Frontend: React app on Vercel configured to consume Render API

⚙️ Setup Instructions
Clone the repo

bash
Copy
Edit
git clone https://github.com/your-username/shuleni-backend.git
cd shuleni-backend
Create virtual environment

bash
Copy
Edit
python -m venv venv
source venv/bin/activate
Install dependencies

bash
Copy
Edit
pip install -r requirements.txt
Create .env file

ini
Copy
Edit
FLASK_ENV=development
SECRET_KEY=your_secret
JWT_SECRET_KEY=your_jwt_key
DATABASE_URL=your_postgres_url
Run database migrations

bash
Copy
Edit
flask db upgrade
Run development server

bash
Copy
Edit
flask run
✍️ Contributors
Sharon Kendi – Backend Developer

🏫 License
This project is part of the Moringa School Phase 5 capstone.