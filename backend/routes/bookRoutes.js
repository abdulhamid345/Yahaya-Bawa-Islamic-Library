const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  getBooksByScholar,
  getBooksByCategory,
  downloadBook,
  searchBooks,
  getBookChapters,
  getChapter,
  addBookChapter,
  updateChapter,
  deleteChapter
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');
const { uploadBook, uploadImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/search', searchBooks);
router.get('/scholar/:scholarId', getBooksByScholar);
router.get('/category/:categoryId', getBooksByCategory);
router.get('/:id', getBookById);
router.get('/:id/download', downloadBook);
router.get('/:id/chapters', getBookChapters);
router.get('/:id/chapters/:chapterId', getChapter);

// Admin routes
router.post('/',
  protect,
  authorize('admin', 'librarian'),
  uploadBook.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
  ]),
  handleUploadError,
  createBook
);

router.put('/:id',
  protect,
  authorize('admin', 'librarian'),
  uploadBook.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
  ]),
  handleUploadError,
  updateBook
);

router.delete('/:id',
  protect,
  authorize('admin', 'librarian'),
  deleteBook
);

// Chapter routes
router.post('/:id/chapters',
  protect,
  authorize('admin', 'librarian'),
  addBookChapter
);

router.put('/:id/chapters/:chapterId',
  protect,
  authorize('admin', 'librarian'),
  updateChapter
);

router.delete('/:id/chapters/:chapterId',
  protect,
  authorize('admin', 'librarian'),
  deleteChapter
);

module.exports = router;