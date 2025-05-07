const express = require('express');
const {
  uploadBook,
  uploadImage,
  deleteFile,
  getUploadConfig
} = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/config', getUploadConfig);

// Admin routes
router.post('/book',
  protect,
  authorize('admin', 'librarian'),
  upload.uploadBook.single('file'),
  upload.handleUploadError,
  uploadBook
);

router.post('/image',
  protect,
  authorize('admin', 'librarian'),
  upload.uploadImage.single('file'),
  upload.handleUploadError,
  uploadImage
);

router.delete('/:type/:filename',
  protect,
  authorize('admin', 'librarian'),
  deleteFile
);

module.exports = router;