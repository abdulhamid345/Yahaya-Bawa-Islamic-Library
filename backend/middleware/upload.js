const path = require('path');
const multer = require('multer');
const config = require('../config/config');
const fs = require('fs');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    config.uploadPath.books,
    config.uploadPath.images
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration for book uploads
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath.books);
  },
  filename: (req, file, cb) => {
    // Create a unique file name with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `book-${uniqueSuffix}${fileExt}`);
  }
});

// Storage configuration for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath.images);
  },
  filename: (req, file, cb) => {
    // Create a unique file name with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${fileExt}`);
  }
});

// File filter for books
const bookFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (config.allowedFileTypes.books.includes(fileExt)) {
    return cb(null, true);
  }
  
  cb(new Error(`Only ${config.allowedFileTypes.books.join(', ')} files are allowed for books`));
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (config.allowedFileTypes.images.includes(fileExt)) {
    return cb(null, true);
  }
  
  cb(new Error(`Only ${config.allowedFileTypes.images.join(', ')} files are allowed for images`));
};

// Multer upload configuration for books
exports.uploadBook = multer({
  storage: bookStorage,
  fileFilter: bookFilter,
  limits: {
    fileSize: config.maxFileSize.books
  }
});

// Multer upload configuration for images
exports.uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: config.maxFileSize.images
  }
});

// Error handling middleware for multer
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};