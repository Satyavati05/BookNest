# BookNest 📚

BookNest is a full-stack book management and discovery platform that allows users to explore books, search by title or author, filter by category, and maintain a personal reading list.

Developed as part of my Full-Stack Developer internship, this project demonstrates practical skills in REST API development, authentication, authorization, database management, CRUD operations, input validation, and software testing.

## Features

### User Features
- Register and log in
- JWT-based authentication
- Browse and search books by title or author
- Filter books by category
- View paginated book listings and individual book details
- Add and remove books from a personal reading list
- Track reading progress using `WANT_TO_READ`, `CURRENTLY_READING`, and `READ`
- Add ratings and reviews
- View and update profile information
- Change account password

### Admin Features
- Admin authentication and authorization
- Create, update, and delete books
- Create, update, and delete categories

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- PostgreSQL
- `pg` PostgreSQL client
- JSON Web Tokens (JWT)
- `bcryptjs`
- CORS
- `dotenv`

**Tools**
- Visual Studio Code
- Thunder Client
- Git and GitHub

## Project Structure

```text
BookNest/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

*This tree shows the main directories and representative files.*

## Authentication and Authorization

BookNest uses JSON Web Tokens (JWT) to authenticate users and protect restricted endpoints. Passwords are hashed with `bcryptjs` before being stored in the database.

Protected endpoints require an access token in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

| Access level | Permissions |
|---|---|
| Public | Browse books and categories; register and log in |
| Authenticated user | Manage their reading list and profile |
| Admin | Manage books and categories |

Admin-only operations are protected by authentication and admin authorization middleware.

## API Endpoints

The backend API uses `/api` as its base path.

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Profile

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/profile` | Authenticated |
| PUT | `/api/profile` | Authenticated |
| PUT | `/api/profile/password` | Authenticated |

### Books

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/books` | Public |
| GET | `/api/books/:id` | Public |
| POST | `/api/books` | Admin |
| PUT | `/api/books/:id` | Admin |
| DELETE | `/api/books/:id` | Admin |

### Categories

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/categories` | Public |
| GET | `/api/categories/:id` | Public |
| POST | `/api/categories` | Admin |
| PUT | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Reading List

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reading-list` | Authenticated |
| GET | `/api/reading-list` | Authenticated |
| PUT | `/api/reading-list/:id` | Owner only |
| DELETE | `/api/reading-list/:id` | Owner only |

## Search, Filtering, and Pagination

Search books by title or author:

```http
GET /api/books?search=atomic
```

Filter by category:

```http
GET /api/books?category_id=1
```

Retrieve paginated results:

```http
GET /api/books?page=1&limit=10
```

Combine search, filtering, and pagination:

```http
GET /api/books?search=atomic&category_id=1&page=1&limit=10
```

Pagination validation includes:
- `page` must be a positive integer.
- `limit` must be between 1 and 100.
- `category_id` must be a positive integer.

## Database Design

BookNest uses PostgreSQL with four main tables:

- `users`
- `books`
- `categories`
- `reading_list`

The `reading_list` table connects users with books and stores user-specific information such as reading status, rating, and review. Reading status belongs to the reading-list entry—not the book itself—because different users can have different reading statuses for the same book.

## Validation and Error Handling

The API uses standard HTTP status codes, including:

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required or invalid credentials |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 500 | Internal server error |

Validation and error handling cover authentication inputs, authorization, pagination, category IDs, missing resources, invalid reading statuses, duplicate reading-list entries, and unauthorized reading-list modifications.

## Testing

The project includes automated backend tests and manual API verification.

**Latest automated backend test results:**
- 20 tests passed
- 0 tests failed
- Authentication and registration validation
- Book listing, pagination, category validation, and missing-book handling
- JWT authentication middleware
- Admin authorization middleware

Frontend quality checks:
- ESLint completed without reported errors.
- Vite production build completed successfully.

Manual API checks have also covered registration, login, JWT-protected access, categories, book listings, and CORS preflight behavior.

## Setup and Installation

### Prerequisites
- Node.js and npm
- Git
- A PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/Satyavati05/BookNest.git
cd BookNest
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory using `.env.example` as a reference.

Configure these variables with your own values:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=replace_with_a_strong_random_secret
FRONTEND_URL=http://localhost:5173
```

- `DATABASE_URL` must point to a PostgreSQL database with the required BookNest schema.
- `JWT_SECRET` must be a strong, private secret.
- `FRONTEND_URL` should match the frontend origin allowed to access the API.

**Never commit your actual `.env` file or expose database credentials or JWT secrets.** The application verifies the database connection and schema during startup; it does not automatically create the database schema.

Start the backend:

```bash
npm start
```

The API uses `http://localhost:5000` by default.

### 3. Configure and start the frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file using `frontend/.env.example` as a reference:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

### 4. Run quality checks

Backend tests:

```bash
cd backend
npm test
```

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend production build:

```bash
npm run build
```

The production frontend files are generated in `frontend/dist/`.

## Deployment
BookNest is deployed and accessible online. The React frontend is hosted on Vercel, the Express.js backend is hosted on Render, and PostgreSQL is used for persistent data storage.

- **Live Application:** https://book-nest-theta-opal.vercel.app/
- **Backend API:** https://booknest-api-yc42.onrender.com
- **Books API:** https://booknest-api-yc42.onrender.com/api/books
- **Categories API:** https://booknest-api-yc42.onrender.com/api/categories

The production backend uses environment variables for database connectivity, JWT authentication, and frontend CORS configuration. The deployed application has been manually tested for registration, login, logout, book browsing, categories, book details, reading-list persistence, admin authorization, and admin book/category management.


## Internship Tasks and Documentation

### Task 3 — BookNest Project Development

[View Task 3 Report](https://canva.link/k8tv7763ileepps)

### Task 4 — Testing and Quality Assurance

[View Task 4 Report](https://canva.link/cpcfbt6zma1z893)

The Task 4 report documents automated backend tests, API validation, authentication and authorization checks, reading-list functionality, and responsive UI testing.

### Task 5 — Deployment and Production

[View Task 5 Report](https://canva.link/kp1256uui5wq0lq)

The Task 5 report documents BookNest's production deployment, hosting architecture, environment configuration, CORS and routing fixes, and manual verification of key user and admin workflows.

## Author

**Satyavati Thakur**

[GitHub — Satyavati05](https://github.com/Satyavati05)

---

*BookNest is a hands-on full-stack learning project focused on practical frontend development, backend APIs, relational database management, authentication, and software quality assurance.*
