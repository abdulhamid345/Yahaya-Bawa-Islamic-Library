# Yahaya Bawa Islamic Library Backend Summary

This document provides a comprehensive overview of the backend system created for the Yahaya Bawa Islamic Library, with special focus on how it supports both the frontend and admin dashboard.

## Architecture Overview

The backend is built using a modern Node.js/Express architecture with MongoDB as the database. It follows a modular structure with clear separation of concerns:

- **Models**: Define database schemas and business logic
- **Controllers**: Handle request processing and responses
- **Routes**: Define API endpoints and connect them to controllers
- **Middleware**: Provide authentication, error handling, and other cross-cutting concerns
- **Config**: Store configuration settings
- **Utils**: House utility functions

## Core Components

### Database Models

1. **User Model** (`models/User.js`)
   - User authentication and profile information
   - Borrowing history tracking
   - Role-based permissions (user, librarian, admin)

2. **Book Model** (`models/Book.js`)
   - Complete book metadata
   - Availability tracking
   - Borrowing records
   - Download statistics

3. **Scholar Model** (`models/Scholar.js`)
   - Scholar biographical information
   - Works and contributions
   - Timeline events

4. **Category Model** (`models/Category.js`)
   - Hierarchical organization of books
   - Featured book tracking
   - Book count statistics

5. **Chapter Model** (`models/Chapter.js`)
   - Book chapter content
   - Original Arabic text support

### Authentication System

- **JWT-based authentication** for secure access
- **Passport.js integration** for strategy management
- **Role-based authorization** for different access levels:
  - Public routes (browsing books, scholars, etc.)
  - User routes (borrowing, profile management, etc.)
  - Admin routes (content management, user administration, etc.)

### File Management

- **Structured upload system** for:
  - Book files (PDF, EPUB, etc.)
  - Images (scholar photos, book covers)
- **File validation** to ensure security and quality
- **Organized storage** with proper access controls

### API Endpoints

The backend provides a comprehensive set of RESTful API endpoints:

#### Public APIs
- Book browsing and searching
- Scholar information
- Category navigation
- Chapter reading

#### User APIs
- Registration and authentication
- Profile management
- Book borrowing and returning

#### Admin APIs
- Dashboard statistics
- Content management (books, scholars, categories)
- User management
- File uploads
- Featured content curation

## Admin Dashboard Support

The backend specifically supports the admin dashboard with dedicated controllers and routes:

### Admin Controller (`controllers/adminController.js`)

Provides specialized endpoints for the admin dashboard:

1. **Dashboard Statistics**
   - User, book, scholar, and category counts
   - Recent registrations
   - Top downloaded books
   - Recent activities

2. **Scholar Management**
   - Comprehensive scholar listing with book counts
   - Scholar books management

3. **Category Administration**
   - Category listing with actual vs. recorded book counts
   - Category modification tools

4. **User Administration**
   - User listing with borrowing information
   - Role management

5. **Book Management**
   - Comprehensive book listing
   - Book creation, updating, and deletion

6. **Featured Content Curation**
   - Setting featured status for books, scholars, and categories

7. **Borrowing Oversight**
   - Complete borrowing history
   - Overdue book tracking

### Admin Routes (`routes/adminRoutes.js`)

All admin routes are protected by both authentication and role-based authorization:

```javascript
router.use(protect);
router.use(authorize('admin'));
```

This ensures that only authenticated users with admin privileges can access the admin dashboard functionality.

## Security Features

The backend implements several security measures:

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control
3. **Input Validation**: Request data validation
4. **Error Handling**: Comprehensive error management
5. **Password Security**: Hashing with bcrypt
6. **File Upload Security**: File type and size validation

## Deployment Considerations

The backend is designed to be easily deployed on Hostinger:

1. **Environment Configuration**: Using dotenv for environment variables
2. **Database Flexibility**: Works with MongoDB Atlas for cloud hosting
3. **Process Management**: PM2 integration for reliability
4. **Static File Serving**: Express static middleware for uploads
5. **Deployment Scripts**: Helper scripts for easier deployment

## Integration with Frontend

The backend seamlessly integrates with the Vue.js frontend:

1. **CORS Support**: Cross-origin resource sharing enabled
2. **JSON Responses**: Structured response format
3. **Pagination**: Support for paginated results
4. **Search**: Text search functionality
5. **Filtering**: Support for filtering results by various criteria

## Admin Dashboard Integration

The admin dashboard HTML file (`admin-dashboard.html`) interfaces with these backend endpoints, allowing administrators to:

1. **Manage Scholars**:
   - View all scholars
   - Add new scholars
   - Edit existing scholars
   - Delete scholars

2. **Manage Books**:
   - View all books
   - Add new books
   - Upload book files
   - Edit book details
   - Delete books

3. **Set Featured Content**:
   - Feature important scholars
   - Feature notable books
   - Feature key categories

## Extension Points

The backend is designed to be extensible:

1. **Additional Content Types**: The architecture allows for adding new content types
2. **Enhanced Search**: The text indexing can be expanded
3. **Analytics**: The system can be extended with more detailed analytics
4. **Multi-language Support**: The models already support Arabic content

## Conclusion

The Yahaya Bawa Islamic Library backend provides a robust foundation for both the public-facing website and the administrative dashboard. Its modular design, comprehensive API, and security features ensure that it can meet the needs of the library while being maintainable and extensible for future growth.