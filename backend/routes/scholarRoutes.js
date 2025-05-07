const express = require('express');
const {
  getScholars,
  getScholarById,
  createScholar,
  updateScholar,
  deleteScholar,
  getFeaturedScholars,
  getScholarWorks,
  getScholarTimeline,
  updateScholarTimeline
} = require('../controllers/scholarController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getScholars);
router.get('/featured', getFeaturedScholars);
router.get('/:id', getScholarById);
router.get('/:id/works', getScholarWorks);
router.get('/:id/timeline', getScholarTimeline);

// Admin routes
router.post('/',
  protect,
  authorize('admin', 'librarian'),
  uploadImage.single('image'),
  handleUploadError,
  createScholar
);

router.put('/:id',
  protect,
  authorize('admin', 'librarian'),
  uploadImage.single('image'),
  handleUploadError,
  updateScholar
);

router.delete('/:id',
  protect,
  authorize('admin', 'librarian'),
  deleteScholar
);

router.put('/:id/timeline',
  protect,
  authorize('admin', 'librarian'),
  updateScholarTimeline
);

module.exports = router;