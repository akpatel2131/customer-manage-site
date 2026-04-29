# Backend

Express-based API for authentication and customer management.

## Responsibilities

- Register and log in users
- Protect customer endpoints with JWT middleware
- Persist users and customers to `src/data/db.js`
- Return paginated customer data

## Main Files

- [src/index.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/index.js)
- [src/controllers/authController.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/controllers/authController.js)
- [src/controllers/customerController.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/controllers/customerController.js)
- [src/middleware/authMiddleware.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/middleware/authMiddleware.js)
- [src/data/db.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/data/db.js)
- [src/data/dbStore.js](/Users/krunalkumararjunbhaipatel/Desktop/crio-projects/customer_support_site/backend/src/data/dbStore.js)

## Setup

### Install dependencies

```bash
npm install
```

### Create `.env`

```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## Run

### Development

```bash
npm run dev
```

### Start

```bash
npm start
```

The server runs on `http://localhost:5000`.

## Routes

### Auth Routes

- `POST /auth/register`
- `POST /auth/login`

### Customer Routes

Protected by JWT in the `Authorization` header.

- `GET /customers?page=1`
- `POST /customers`
- `DELETE /customers/:id`

## Persistence

This project does not use a database server right now.

- Data is stored in `src/data/db.js`
- `dbStore.js` reads and rewrites that file using `fs/promises`
- User registration, customer creation, and customer deletion update the file on disk

## Response Shape For Customers

`GET /customers?page=1` returns:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "summary": {
    "totalCustomers": 0,
    "emailReady": 0,
    "phoneReady": 0
  }
}
```

## Notes

- Restart the backend after environment or server-side code changes.
- Keep real secrets out of git and use `.env` locally.
