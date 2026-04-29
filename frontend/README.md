# Frontend

React + TypeScript client for the Customer Support Site.

## Features

- Login and registration flow
- Protected and public route handling
- Customer dashboard with create, delete, and pagination
- Bottom toast notifications
- Mobile card layout for customer data

## Main Files

- [src/App.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/App.tsx)
- [src/pages/Login.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/pages/Login.tsx)
- [src/pages/Register.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/pages/Register.tsx)
- [src/pages/Dashboard.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/pages/Dashboard.tsx)
- [src/components/CustomerForm.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/components/CustomerForm.tsx)
- [src/components/ProtectedRoute.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/components/ProtectedRoute.tsx)
- [src/components/PublicRoute.tsx](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/components/PublicRoute.tsx)
- [src/api.ts](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/src/api.ts)

## Setup

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

The app runs on `http://localhost:3000`.

## Build

```bash
npm run build
```

## Routing

### Public routes

- `/`
- `/login`
- `/register`

Authenticated users are redirected to `/dashboard`.

### Protected route

- `/dashboard`

Unauthenticated users are redirected to `/`.

## API Integration

The frontend talks to the backend at `http://localhost:5000` through Axios.

Important behavior:

- JWT token is stored locally after login
- Protected customer requests send that token in the `Authorization` header
- Unauthorized API responses log the user out and redirect to login

## Deployment

[netlify.toml](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/frontend/netlify.toml) is included for Netlify-style SPA deployment with redirect fallback.

## Notes

- This app uses CSS modules for page and component styling.
- Forms are managed with `react-hook-form`.
