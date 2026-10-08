# BookNest 📚

BookNest is a full-stack book management and discovery platform where users can browse books, search and filter by category, and maintain a personal reading list.

The project was developed as part of my Full-Stack Developer internship to demonstrate practical implementation of REST APIs, authentication, authorization, database management, CRUD operations, validation, and testing.

## Features

### User Features
- User registration and login
- JWT-based authentication
- Browse available books
- Search books by title or author
- Filter books by category
- Paginated book listings
- View individual book details
- Add books to a personal reading list
- Update reading status
- Add ratings and reviews
- Remove books from the reading list

### Admin Features
- Admin authentication and authorization
- Add books
- Update books
- Delete books
- Create categories
- Update categories
- Delete categories

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3
- JWT
- bcryptjs
- CORS

### Development Tools
- Visual Studio Code
- Thunder Client
- Git & GitHub

## Project Structure

BookNest/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bookController.js
│   │   │   ├── categoryController.js
│   │   │   └── readingListController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── bookModel.js
│   │   │   ├── categoryModel.js
│   │   │   ├── readingListModel.js
│   │   │   └── userModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── bookRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── readingListRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── bookService.js
│   │   │   ├── categoryService.js
│   │   │   └── readingListService.js
│   │   │
│   │   └── validators/
│   │       └── authValidator.js
│   │
│   |
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md

## Authentication & Authorization

BookNest uses JWT-based authentication.

Protected endpoints require an access token:

Authorization: Bearer <JWT_TOKEN>

Passwords are securely hashed using bcryptjs before being stored.

### Access Levels

| User Type | Access |
|---|---|
| Public | Browse books and categories |
| Authenticated User | Manage personal reading list |
| Admin | Manage books and categories |

Admin-only operations are protected using authentication and admin authorization middleware.

---

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

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
| POST | `/api/reading-list` | Authenticated User |
| GET | `/api/reading-list` | Authenticated User |
| PUT | `/api/reading-list/:id` | Owner Only |
| DELETE | `/api/reading-list/:id` | Owner Only |

---

## Search, Filtering & Pagination

Books can be searched by title or author.

Example:

`GET /api/books?search=atomic`

Books can also be filtered by category:

`GET /api/books?category_id=1`

Pagination is supported:

`GET /api/books?page=1&limit=10`

Multiple parameters can be combined:

`GET /api/books?search=atomic&category_id=1&page=1&limit=10`

Pagination validation includes:

- `page` must be a positive integer.
- `limit` must be between 1 and 100.
- `category_id` must be a positive integer.

---

## Reading List

Each authenticated user has their own reading list.

Supported reading statuses:

- `WANT_TO_READ`
- `CURRENTLY_READING`
- `READ`

Users can:

- Add books to their reading list.
- Update reading status.
- Add ratings and reviews.
- Remove books.
- Access only their own reading-list items.

Duplicate books are prevented from being added to the same user's reading list.

---

## Database Design

BookNest currently uses SQLite.

### Main Tables

- `users`
- `books`
- `categories`
- `reading_list`

The `reading_list` table connects users with books and stores user-specific information such as reading status, rating, and review.

The reading status belongs to `reading_list` rather than `books` because different users can have different reading statuses for the same book.

---

## Validation & Error Handling

The API uses standard HTTP status codes.

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 500 | Server error |

Validation and error handling have been implemented for:

- Authentication
- Admin authorization
- Duplicate categories
- Duplicate reading-list entries
- Invalid reading-list statuses
- Invalid pagination parameters
- Invalid category IDs
- Non-existent books and categories
- Unauthorized reading-list modifications

---

## Testing

The API was manually tested using Thunder Client.

### Authentication Testing

- User registration
- User login
- Missing JWT
- Valid JWT authentication

### Authorization Testing

Admin and non-admin users were tested separately.

Examples:

- Request without JWT → `401 Unauthorized`
- Authenticated non-admin accessing admin endpoint → `403 Forbidden`
- Authenticated admin accessing admin endpoint → request allowed

### Book Testing

- Create book
- Get all books
- Get individual book
- Update book
- Delete book
- Search by title
- Search by author
- Category filtering
- Pagination
- Invalid page values
- Invalid limit values
- Invalid category values
- Non-existent book

### Category Testing

- Create category
- Get all categories
- Get individual category
- Update category
- Delete category
- Duplicate category prevention
- Admin authorization
- Non-admin authorization

### Reading List Testing

- Add book
- Get personal reading list
- Update reading status
- Add rating and review
- Remove book
- Duplicate book prevention
- Invalid status handling
- Non-existent book handling
- Unauthorized update attempt
- Unauthorized delete attempt

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Satyavati05/BookNest.git