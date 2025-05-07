const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// @desc    Upload a book file
// @route   POST /api/upload/book
// @access  Private/Admin
exports.uploadBook = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/books/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

// @desc    Upload an image
// @route   POST /api/upload/image
// @access  Private/Admin
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/images/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
};

// @desc    Delete a file
// @route   DELETE /api/upload/:type/:filename
// @access  Private/Admin
exports.deleteFile = (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Validate file type
    if (!['books', 'images'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type'
      });
    }
    
    const filePath = path.join(__dirname, '..', 'uploads', type, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    });
  }
};

// @desc    Get allowed file types and sizes
// @route   GET /api/upload/config
// @access  Public
exports.getUploadConfig = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      maxFileSize: config.maxFileSize,
      allowedFileTypes: config.allowedFileTypes
    }
  });
};