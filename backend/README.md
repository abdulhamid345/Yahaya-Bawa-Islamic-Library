# Yahaya Bawa Islamic Library - Backend System

A complete backend system for the Yahaya Bawa Islamic Library, designed to work with your Vue.js frontend and provide comprehensive admin dashboard functionality.

## Overview

This backend system provides a RESTful API for managing an Islamic library with books, scholars, categories, and user management. It's built with Node.js, Express, and MongoDB, featuring JWT authentication, file uploads, and admin dashboard support.

## Features

- **User Management**
  - Registration and authentication
  - Role-based access control (users, librarians, admin)
  - User profiles and borrowing history
  
- **Book Management**
  - Complete book metadata with Arabic title support
  - File uploads for books (PDF, EPUB, etc.)
  - Chapter-based content organization
  - Download tracking and statistics
  
- **Scholar Profiles**
  - Biographical information
  - Timeline of important events
  - Work cataloging and organization
  
- **Category Organization**
  - Hierarchical categorization of books
  - Featured content management
  - Icon support for visual representation
  
- **Admin Dashboard**
  - Statistics and overviews
  - Content management (scholars, books, categories)
  - User administration
  - Borrowing oversight

## Directory Structure

```
backend/
├── config/               # Configuration files
│   ├── db.js             # Database connection
│   ├── passport.js       # Authentication config
│   └── config.js         # General configuration
│
├── controllers/          # API logic
│   ├── userController.js     # User management
│   ├── bookController.js     # Book operations
│   ├── scholarController.js  # Scholar management
│   ├── categoryController.js # Category organization
│   ├── uploadController.js   # File uploads
│   └── adminController.js    # Admin dashboard
│
├── middleware/           # Express middleware
│   ├── auth.js           # Authentication middleware
│   ├── upload.js         # File upload middleware
│   └── errorHandler.js   # Error handling
│
├── models/               # MongoDB schemas
│   ├── User.js           # User model
│   ├── Book.js           # Book model
│   ├── Scholar.js        # Scholar model
│   ├── Category.js       # Category model
│   └── Chapter.js        # Chapter model
│
├── routes/               # API routes
│   ├── userRoutes.js     # User endpoints
│   ├── bookRoutes.js     # Book endpoints
│   ├── scholarRoutes.js  # Scholar endpoints
│   ├── categoryRoutes.js # Category endpoints
│   ├── uploadRoutes.js   # Upload endpoints
│   └── adminRoutes.js    # Admin endpoints
│
├── scripts/              # Utility scripts
│   ├── seed.js           # Database seeding
│   └── deploy.js         # Deployment helper
│
├── uploads/              # Uploaded files directory
│   ├── books/            # Book files
│   └── images/           # Image files
│
├── .env.template         # Environment variables template
├── .gitignore            # Git ignore file
├── ecosystem.config.js   # PM2 configuration
├── package.json          # Dependencies
└── server.js             # Application entry point
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Books

- `GET /api/books` - Get all books
- `GET /api/books/featured` - Get featured books
- `GET /api/books/search` - Search books
- `GET /api/books/scholar/:scholarId` - Get books by scholar
- `GET /api/books/category/:categoryId` - Get books by category
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create a new book (admin/librarian)
- `PUT /api/books/:id` - Update a book (admin/librarian)
- `DELETE /api/books/:id` - Delete a book (admin/librarian)
- `GET /api/books/:id/download` - Download a book file
- `GET /api/books/:id/chapters` - Get all chapters of a book
- `GET /api/books/:id/chapters/:chapterId` - Get a specific chapter
- `POST /api/books/:id/chapters` - Add a chapter (admin/librarian)
- `PUT /api/books/:id/chapters/:chapterId` - Update a chapter (admin/librarian)
- `DELETE /api/books/:id/chapters/:chapterId` - Delete a chapter (admin/librarian)

### Scholars

- `GET /api/scholars` - Get all scholars
- `GET /api/scholars/featured` - Get featured scholars
- `GET /api/scholars/:id` - Get scholar by ID
- `POST /api/scholars` - Create a new scholar (admin/librarian)
- `PUT /api/scholars/:id` - Update a scholar (admin/librarian)
- `DELETE /api/scholars/:id` - Delete a scholar (admin/librarian)
- `GET /api/scholars/:id/works` - Get scholar's works
- `GET /api/scholars/:id/timeline` - Get scholar's timeline
- `PUT /api/scholars/:id/timeline` - Update timeline (admin/librarian)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/featured` - Get featured categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category (admin/librarian)
- `PUT /api/categories/:id` - Update a category (admin/librarian)
- `DELETE /api/categories/:id` - Delete a category (admin/librarian)
- `PUT /api/categories/:id/featured-book` - Set featured book (admin/librarian)
- `GET /api/categories/:id/books` - Get books in a category

### Uploads

- `POST /api/upload/book` - Upload a book file (admin/librarian)
- `POST /api/upload/image` - Upload an image (admin/librarian)
- `DELETE /api/upload/:type/:filename` - Delete a file (admin/librarian)
- `GET /api/upload/config` - Get upload configuration

### Admin Dashboard

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/scholars` - Manage scholars
- `GET /api/admin/scholars/:scholarId/books` - Get books by scholar
- `GET /api/admin/categories` - Manage categories
- `GET /api/admin/users` - Manage users
- `GET /api/admin/books` - Manage books
- `PUT /api/admin/featured/:type/:id` - Set featured items
- `GET /api/admin/borrowings` - Get borrowing history

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd yahaya-bawa-islamic-library-backend
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file based on `.env.template`
```
cp .env.template .env
```

4. Update the `.env` file with your configuration

5. Create upload directories
```
mkdir -p uploads/books uploads/images
```

6. Seed the database with initial data
```
npm run seed
```

7. Start the development server
```
npm run dev
```

The server will start on the port specified in your .env file (default: 5000).

## Admin Dashboard Integration

The backend provides full support for the Vue.js admin dashboard. To integrate your dashboard with the backend:

1. Update your login function to use JWT authentication
2. Add authorization header to your API requests
3. Connect your frontend components to the corresponding API endpoints
4. Update your forms to send data in the correct format
5. Handle file uploads using FormData

For detailed integration instructions, see the `ADMIN_INTEGRATION_GUIDE.md` file.

## Deployment on Hostinger

This backend is specifically designed to work with Hostinger hosting. To deploy:

1. Set up MongoDB Atlas for your database
2. Run the deployment script to prepare necessary files
   ```
   node scripts/deploy.js
   ```
3. Upload the backend code to Hostinger
4. Configure environment variables in Hostinger's control panel
5. Start the server with PM2
   ```
   pm2 start ecosystem.config.js
   ```

For detailed deployment instructions, see the `HOSTINGER_DEPLOYMENT.md` file.

## Key Files and Their Purpose

- `server.js` - Main application entry point
- `config/db.js` - Database connection configuration
- `config/passport.js` - Authentication configuration
- `models/*.js` - Database schemas and models
- `controllers/*.js` - Business logic for the API
- `routes/*.js` - API endpoint definitions
- `middleware/auth.js` - JWT authentication and authorization
- `middleware/upload.js` - File upload handling
- `scripts/seed.js` - Initial data seeding script
- `scripts/deploy.js` - Deployment helper script

## Security Features

- JWT authentication for secure API access
- Password hashing with bcrypt
- Role-based authorization for different access levels
- File upload validation for security
- Input validation on all API endpoints
- CORS configuration for frontend access

## Admin Dashboard Features

The backend provides dedicated support for admin dashboard functionality:

- Statistical overviews of library content
- Scholar management with book associations
- Book uploads and organization
- Category management
- User administration
- Featured content curation
- Borrowing history tracking

For details on admin functionality, see the `ADMIN_DASHBOARD_SETUP.md` file.

## Development

### Running in Development Mode

```
npm run dev
```

This starts the server with nodemon for automatic reloading.

### Database Seeding

To populate the database with initial data:

```
npm run seed
```

This creates sample scholars, books, categories, and users including an admin user.

### Environment Variables

Configure the following environment variables in your `.env` file:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development, production)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time (default: 30d)

## Support and Documentation

Additional documentation files included in this project:

- `ADMIN_INTEGRATION_GUIDE.md` - Guide for integrating the admin dashboard
- `HOSTINGER_DEPLOYMENT.md` - Detailed Hostinger deployment instructions
- `ADMIN_DASHBOARD_SETUP.md` - Admin dashboard configuration guide
- `BACKEND_SUMMARY.md` - Technical overview of backend architecture

## License

This project is licensed under the MIT License.