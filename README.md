# Mail Creator AI

Mail Creator AI is a full-stack AI-powered web application that helps users generate professional official emails instantly. Users can register, log in, choose from real-world email templates, generate emails using AI, regenerate improved versions, download emails as PDF, copy content, and open Gmail compose directly.

---

## 🚀 Project Overview

Mail Creator AI is designed for students, employees, HR professionals, business users, and anyone who needs to create formal emails quickly. The application provides ready-to-use templates for HR, career, management, business, support, academic, and official communication.

The system uses AI to convert user-provided details into polished, professional emails with the selected tone.

---

## ✨ Key Features

- User registration and login with JWT authentication
- Secure password hashing using bcrypt
- AI-powered professional email generation
- 24 real-world industry email templates
- Template search and category filtering
- Compose form with clear/reset actions
- Mail regeneration using AI
- PDF export using backend PDF generation
- Gmail compose integration
- Copy generated email to clipboard
- Dashboard with animated counters
- Search and filter generated mails
- Dark mode support
- Protected routes
- User-specific mail isolation
- Secure delete with ownership check
- Backend request validation
- Health check API
- Production-ready environment setup

---

## 🧰 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- Groq AI API
- PDFKit
- express-validator

---

## 📁 Project Structure

```txt
mail-creator
├── client
│   ├── public
│   │   └── mail-creator-icon.svg
│   ├── src
│   │   ├── components
│   │   ├── lib
│   │   │   └── axios.js
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Compose.jsx
│   │   │   ├── MailView.jsx
│   │   │   └── Templates.jsx
│   │   ├── store
│   │   │   └── authStore.js
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   └── package.json
│
├── server
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── config
│   │   │   ├── env.js
│   │   │   └── prisma.js
│   │   ├── controllers
│   │   │   ├── auth.controller.js
│   │   │   └── mail.controller.js
│   │   ├── middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── validateRequest.middleware.js
│   │   ├── routes
│   │   │   ├── auth.routes.js
│   │   │   └── mail.routes.js
│   │   ├── services
│   │   │   ├── gemini.service.js
│   │   │   └── pdf.service.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📌 Email Template Categories

The application includes templates for:

- HR
- Career
- Management
- Business
- Support
- Academic
- Official

Example templates include:

- Leave Request
- Work From Home Request
- Salary Increment Request
- Resignation Letter
- Job Application
- Internship Application
- Interview Follow-up
- Offer Acceptance
- Project Status Update
- Deadline Extension
- Meeting Request
- Client Proposal
- Payment Reminder
- Apology for Delay
- Customer Support Reply
- Refund Request
- Request for Certificate
- Permission Letter
- Event Invitation

---

## 🔐 Authentication

The application uses JWT-based authentication.

Authentication flow:

1. User registers with name, email, password, and organization.
2. Password is hashed using bcrypt.
3. Backend generates a JWT token.
4. Frontend stores the token and user details.
5. Axios interceptor attaches the token to protected API requests.
6. Protected routes require a valid token.

---

## 🤖 AI Mail Generation Flow

1. User enters mail details or selects a template.
2. Frontend sends the data to the backend.
3. Backend validates the request.
4. Backend fetches the authenticated user details.
5. AI service generates a professional email using Groq API.
6. Generated mail is saved in PostgreSQL using Prisma.
7. User can view, copy, regenerate, export, or delete the mail.

---

## 📄 PDF Export

Generated emails can be exported as PDF using the backend PDFKit service.

The PDF export endpoint generates a downloadable PDF file from the saved mail content.

---

## 🧪 API Endpoints

### Auth Routes

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Mail Routes

```txt
POST   /api/mails
GET    /api/mails
GET    /api/mails/:id
DELETE /api/mails/:id
POST   /api/mails/:id/regenerate
GET    /api/mails/:id/export/pdf
```

### Health Check

```txt
GET /api/health
```

---

## ⚙️ Environment Variables

### Backend `.env`

Create a `.env` file inside the `server` folder.

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mail_creator?schema=public"

JWT_SECRET="replace_with_a_long_random_secret_minimum_32_characters"
JWT_EXPIRES_IN=7d

GROQ_API_KEY="your_groq_api_key_here"

CLIENT_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
```

### Frontend `.env`

Create a `.env` file inside the `client` folder.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ▶️ How to Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mail-creator
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Setup backend environment

Create `.env` inside the `server` folder using `.env.example`.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run database migration

```bash
npx prisma migrate dev
```

### 6. Start backend

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

### 7. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 8. Setup frontend environment

Create `.env` inside the `client` folder using `.env.example`.

### 9. Start frontend

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## 🏗️ Build Commands

### Frontend build

```bash
cd client
npm run build
```

### Backend production start

```bash
cd server
npm start
```

---

## 🔒 Security Improvements Implemented

- Passwords are hashed using bcrypt
- JWT-based protected routes
- User-specific mail access
- Delete mail ownership check
- Request validation using express-validator
- Environment variable based configuration
- CORS configuration for allowed client URLs
- Real secrets excluded from Git using `.gitignore`

---

## 🧑‍💻 Resume Highlights

- Built a full-stack AI-powered email generation platform using React, Node.js, Express, PostgreSQL, Prisma, and Groq AI.
- Implemented JWT authentication, bcrypt password hashing, protected routes, and user-specific data isolation.
- Integrated AI mail generation, regeneration, PDF export, Gmail compose support, and real-world email templates.
- Designed a responsive Tailwind CSS interface with dark mode, animated dashboard counters, loading states, and professional UI components.
- Added backend validation, environment configuration, health check API, and production-ready project structure.

---

## 🚀 Deployment Plan

Recommended deployment platforms:

```txt
Frontend: Vercel
Backend: Railway
Database: Railway PostgreSQL or Neon PostgreSQL
```

### Backend production environment variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="your_production_postgresql_url"
JWT_SECRET="your_long_secure_jwt_secret"
JWT_EXPIRES_IN=7d
GROQ_API_KEY="your_groq_api_key"
CLIENT_URLS=https://your-frontend-domain.vercel.app
```

### Frontend production environment variable

```env
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
```

---

## 🔮 Future Enhancements

- Save custom user templates
- Multilingual email generation
- Analytics dashboard for generated mails
- Browser extension for Gmail
- Team collaboration and shared templates
- Email scheduling
- Rich text editor
- Attachment support
- AI tone improvement suggestions
- User writing style personalization

---

## 📌 Project Status

```txt
Status: Completed
Frontend Build: Passed
Backend Health API: Working
Core Features: Completed
Ready for GitHub: Yes
Ready for Deployment: Yes
```

---

## 👤 Author

**Chandan K**

Full Stack Developer | Java | React | Node.js | Spring Boot | MySQL | PostgreSQL
