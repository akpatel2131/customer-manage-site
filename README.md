# Customer Support Site

A full-stack customer support dashboard with authentication, protected routes, customer management, responsive UI, and file-based persistence.

## Project Structure

```text
customer_support_site/
├── backend/    # Express API, auth, customer routes, file-backed data
├── frontend/   # React + TypeScript client
└── README.md
```

## Features

- User registration and login with JWT-based authentication
- Protected dashboard route
- Customer create, list, delete flow
- API-driven pagination
- Mobile-friendly dashboard with card view on small screens
- File-backed persistence through `backend/src/data/db.js`

## Tech Stack

- Frontend: React, TypeScript, React Router, React Hook Form, Axios
- Backend: Node.js, Express, JSON Web Token, CORS
- Storage: local file persistence via `fs`

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Create backend environment variables

Create a `backend/.env` file:

```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:5000`.

### 4. Start the frontend

```bash
cd frontend
npm start
```

The app runs on `http://localhost:3000`.

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Customers

These routes require the JWT token in the `Authorization` header.

- `GET /customers?page=1`
- `POST /customers`
- `DELETE /customers/:id`

## Notes

- Customer and user data are persisted in [backend/src/data/db.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/data/db.js).
- The backend rewrites that file using [backend/src/data/dbStore.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/data/dbStore.js).
- If you change backend logic related to persistence, restart the backend server.

## Folder Docs

- Frontend guide: [frontend/README.md](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/README.md)
- Backend guide: [backend/README.md](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/README.md)
