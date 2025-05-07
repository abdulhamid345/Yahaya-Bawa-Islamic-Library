const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  updateFeaturedBook,
  getCategoryBooks
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/featured', getFeaturedCategories);
router.get('/:id', getCategoryById);
router.get('/:id/books', getCategoryBooks);

// Admin routes
router.post('/',
  protect,
  authorize('admin', 'librarian'),
  createCategory
);

router.put('/:id',
  protect,
  authorize('admin', 'librarian'),
  updateCategory
);

router.delete('/:id',
  protect,
  authorize('admin', 'librarian'),
  deleteCategory
);

router.put('/:id/featured-book',
  protect,
  authorize('admin', 'librarian'),
  updateFeaturedBook
);

module.exports = router;