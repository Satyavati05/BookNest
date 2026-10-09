# BookNest 📚

BookNest is a full-stack book management and discovery platform where users can browse books, search and filter by category, and maintain a personal reading list.

Developed as part of my Full-Stack Developer internship, this project demonstrates practical implementation of REST APIs, authentication, authorization, database management, CRUD operations, validation, and manual API testing.

## Features

### User Features

* User registration and login
* JWT-based authentication
* Browse available books
* Search books by title or author
* Filter books by category
* Paginated book listings
* View individual book details
* Add books to a personal reading list
* Update reading status
* Add ratings and reviews
* Remove books from the reading list
* View and edit profile information
* Change account password

### Admin Features

* Admin authentication and authorization
* Add, update, and delete books
* Create, update, and delete categories

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* SQLite
* better-sqlite3
* JSON Web Tokens (JWT)
* bcryptjs
* CORS
* dotenv

### Development Tools

* Visual Studio Code
* Thunder Client
* Git and GitHub

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
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

*Note: The tree shows the main directories and representative files. Refer to the repository for the complete structure.*

## Authentication and Authorization

BookNest uses JWT-based authentication to protect user-specific and administrative operations.

Protected endpoints require an access token in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Passwords are hashed using bcryptjs before being stored in the database.

### Access Levels

| User Type          | Access                                   |
| ------------------ | ---------------------------------------- |
| Public             | Browse books and categories              |
| Authenticated User | Manage personal reading list and profile |
| Admin              | Manage books and categories              |

Admin-only operations are protected by authentication and admin authorization middleware.

## API Endpoints

The backend API uses the `/api` base path.

### Authentication

| Method | Endpoint             | Access        |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Public        |
| POST   | `/api/auth/login`    | Public        |
| GET    | `/api/auth/me`       | Authenticated |

### Profile

| Method | Endpoint                | Access        |
| ------ | ----------------------- | ------------- |
| GET    | `/api/profile`          | Authenticated |
| PUT    | `/api/profile`          | Authenticated |
| PUT    | `/api/profile/password` | Authenticated |

### Books

| Method | Endpoint         | Access |
| ------ | ---------------- | ------ |
| GET    | `/api/books`     | Public |
| GET    | `/api/books/:id` | Public |
| POST   | `/api/books`     | Admin  |
| PUT    | `/api/books/:id` | Admin  |
| DELETE | `/api/books/:id` | Admin  |

### Categories

| Method | Endpoint              | Access |
| ------ | --------------------- | ------ |
| GET    | `/api/categories`     | Public |
| GET    | `/api/categories/:id` | Public |
| POST   | `/api/categories`     | Admin  |
| PUT    | `/api/categories/:id` | Admin  |
| DELETE | `/api/categories/:id` | Admin  |

### Reading List

| Method | Endpoint                | Access        |
| ------ | ----------------------- | ------------- |
| POST   | `/api/reading-list`     | Authenticated |
| GET    | `/api/reading-list`     | Authenticated |
| PUT    | `/api/reading-list/:id` | Owner only    |
| DELETE | `/api/reading-list/:id` | Owner only    |

## Search, Filtering, and Pagination

Books can be searched by title or author:

```http
GET /api/books?search=atomic
```

Filter books by category:

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

* `page` must be a positive integer.
* `limit` must be between 1 and 100.
* `category_id` must be a positive integer.

## Reading List

Each authenticated user has an individual reading list.

Supported reading statuses:

* `WANT_TO_READ`
* `CURRENTLY_READING`
* `READ`

Users can add books, update reading status, submit ratings and reviews, and remove books. Reading-list entries are associated with individual users, and duplicate entries for the same user and book are prevented.

## Database Design

BookNest uses SQLite with the following main tables:

* `users`
* `books`
* `categories`
* `reading_list`

The `reading_list` table connects users with books and stores user-specific information such as reading status, rating, and review.

Reading status belongs to the reading-list entry rather than the book itself because different users can have different reading statuses for the same book.

## Validation and Error Handling

The API uses standard HTTP status codes.

| Status | Meaning                                           |
| ------ | ------------------------------------------------- |
| 200    | Request successful                                |
| 201    | Resource created                                  |
| 400    | Invalid request                                   |
| 401    | Authentication required or invalid authentication |
| 403    | Insufficient permissions                          |
| 404    | Resource not found                                |
| 500    | Internal server error                             |

Validation and error handling cover authentication, authorization, duplicate categories, duplicate reading-list entries, invalid reading statuses, pagination parameters, category IDs, missing resources, and unauthorized reading-list modifications.

## Testing

The API was manually tested using Thunder Client.

### Authentication and Authorization

* User registration and login
* Missing and valid JWTs
* Admin and non-admin access
* Profile retrieval and updates
* Password change validation

### Books

* Create, retrieve, update, and delete books
* Search by title and author
* Category filtering
* Pagination and invalid pagination values
* Invalid category IDs and missing books

### Categories

* Create, retrieve, update, and delete categories
* Duplicate category prevention
* Admin authorization

### Reading List

* Add and retrieve books
* Update reading status
* Add ratings and reviews
* Remove books
* Duplicate entry prevention
* Invalid status and missing-book handling
* Unauthorized update and delete attempts

## Setup and Installation

### Prerequisites

* Node.js and npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/Satyavati05/BookNest.git
cd BookNest
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
JWT_SECRET=replace_with_a_strong_random_secret
```

Use a strong, private JWT secret. Never commit your `.env` file or expose your actual secret publicly.

Start the backend:

```bash
node server.js
```

The API should run at `http://localhost:5000`.

### 3. Install frontend dependencies

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

The frontend communicates with the backend at `http://localhost:5000/api`.

### 4. Build the frontend

From the `frontend` directory, run:

```bash
npm run build
```

Vite generates the production build in the `dist` directory.

## Future Improvements

* Automated unit and integration tests
* Deployment of the frontend and backend
* Expanded API documentation
* Additional accessibility and responsive-design improvements

## Author

**Satyavati Thakur**

[GitHub – Satyavati05](https://github.com/Satyavati05)

---

*BookNest was built as a hands-on full-stack learning project focused on developing practical backend, frontend, database, and API development skills.*
