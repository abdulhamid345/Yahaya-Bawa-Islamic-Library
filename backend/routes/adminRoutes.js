const express = require('express');
const {
  getDashboardStats,
  getScholarsAdmin,
  getScholarBooksAdmin,
  getCategoriesAdmin,
  getUsersAdmin,
  getBooksAdmin,
  setFeaturedItem,
  getBorrowingHistory
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/stats', getDashboardStats);

// Scholars management routes
router.get('/scholars', getScholarsAdmin);
router.get('/scholars/:scholarId/books', getScholarBooksAdmin);

// Categories management routes
router.get('/categories', getCategoriesAdmin);

// Users management routes
router.get('/users', getUsersAdmin);

// Books management routes
router.get('/books', getBooksAdmin);

// Featured items routes
router.put('/featured/:type/:id', setFeaturedItem);

// Borrowing history routes
router.get('/borrowings', getBorrowingHistory);

module.exports = router;