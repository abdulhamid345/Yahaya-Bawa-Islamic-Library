const Scholar = require('../models/Scholar');
const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// @desc    Get all scholars
// @route   GET /api/scholars
// @access  Public
exports.getScholars = async (req, res, next) => {
  try {
    const { 
      era, 
      specialty,
      search,
      featured,
      page = 1,
      limit = 10,
      sort = 'name'
    } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (era) query.era = era;
    if (specialty) query.specialties = specialty;
    if (featured === 'true') query.featured = true;
    
    // Apply text search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Determine sort direction (ascending or descending)
    let sortOption = {};
    if (sort.startsWith('-')) {
      sortOption[sort.substring(1)] = -1;
    } else {
      sortOption[sort] = 1;
    }
    
    // Execute query with pagination
    const scholars = await Scholar.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalScholars = await Scholar.countDocuments(query);
    
    // Get distinct eras and specialties for filtering
    const eras = await Scholar.distinct('era');
    const specialties = await Scholar.aggregate([
      { $unwind: '$specialties' },
      { $group: { _id: '$specialties' } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: scholars.length,
      total: totalScholars,
      totalPages: Math.ceil(totalScholars / parseInt(limit)),
      currentPage: parseInt(page),
      filters: {
        eras,
        specialties: specialties.map(s => s._id)
      },
      data: scholars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a scholar by ID
// @route   GET /api/scholars/:id
// @access  Public
exports.getScholarById = async (req, res, next) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    
    if (!scholar) {
      return res.status(404).json({
        success: false,
        message: 'Scholar not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: scholar
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new scholar
// @route   POST /api/scholars
// @access  Private/Admin
exports.createScholar = async (req, res, next) => {
  try {
    // Extract scholar data from request body
    const scholarData = { ...req.body };
    
    // Convert specialties from string to array if needed
    if (scholarData.specialties && typeof scholarData.specialties === 'string') {
      scholarData.specialties = scholarData.specialties.split(',').map(s => s.trim());
    }
    
    // Parse timeline data if it's a string
    if (scholarData.timeline && typeof scholarData.timeline === 'string') {
      try {
        scholarData.timeline = JSON.parse(scholarData.timeline);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Timeline data is invalid JSON'
        });
      }
    }
    
    // Add image path if an image was uploaded
    if (req.file) {
      scholarData.image = `/uploads/images/${req.file.filename}`;
    }
    
    // Create the scholar
    const scholar = await Scholar.create(scholarData);
    
    res.status(201).json({
      success: true,
      message: 'Scholar created successfully',
      data: scholar
    });
  } catch (error) {
    // If an error occurs and a file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    next(error);
  }
};

// @desc    Update a scholar
// @route   PUT /api/scholars/:id
// @access  Private/Admin
exports.updateScholar = async (req, res, next) => {
  try {
    let scholar = await Scholar.findById(req.params.id);
    
    if (!scholar) {
      return res.status(404).json({
        success: false,
        message: 'Scholar not found'
      });
    }
    
    // Extract update data from request body
    const scholarData = { ...req.body };
    
    // Convert specialties from string to array if needed
    if (scholarData.specialties && typeof scholarData.specialties === 'string') {
      scholarData.specialties = scholarData.specialties.split(',').map(s => s.trim());
    }
    
    // Parse timeline data if it's a string
    if (scholarData.timeline && typeof scholarData.timeline === 'string') {
      try {
        scholarData.timeline = JSON.parse(scholarData.timeline);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Timeline data is invalid JSON'
        });
      }
    }
    
    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      if (scholar.image) {
        const oldPath = path.join(__dirname, '..', scholar.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      scholarData.image = `/uploads/images/${req.file.filename}`;
    }
    
    // Update the scholar
    scholar = await Scholar.findByIdAndUpdate(
      req.params.id,
      scholarData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Scholar updated successfully',
      data: scholar
    });
  } catch (error) {
    // If an error occurs and a file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    next(error);
  }
};

// @desc    Delete a scholar
// @route   DELETE /api/scholars/:id
// @access  Private/Admin
exports.deleteScholar = async (req, res, next) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    
    if (!scholar) {
      return res.status(404).json({
        success: false,
        message: 'Scholar not found'
      });
    }
    
    // Check if there are any books associated with this scholar
    const books = await Book.countDocuments({ scholar: req.params.id });
    
    if (books > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete scholar with ${books} associated books. Please reassign or delete the books first.`
      });
    }
    
    // Delete image if it exists
    if (scholar.image) {
      const imagePath = path.join(__dirname, '..', scholar.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the scholar
    await scholar.remove();
    
    res.status(200).json({
      success: true,
      message: 'Scholar deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured scholars
// @route   GET /api/scholars/featured
// @access  Public
exports.getFeaturedScholars = async (req, res, next) => {
  try {
    const scholars = await Scholar.find({ featured: true })
      .select('name initial description specialties')
      .limit(3);
    
    res.status(200).json({
      success: true,
      count: scholars.length,
      data: scholars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scholar works
// @route   GET /api/scholars/:id/works
// @access  Public
exports.getScholarWorks = async (req, res, next) => {
  try {
    const works = await Book.find({ scholar: req.params.id })
      .select('title description category publishedYear downloads')
      .populate('category', 'name');
    
    res.status(200).json({
      success: true,
      count: works.length,
      data: works
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scholar timeline
// @route   GET /api/scholars/:id/timeline
// @access  Public
exports.getScholarTimeline = async (req, res, next) => {
  try {
    const scholar = await Scholar.findById(req.params.id)
      .select('timeline');
    
    if (!scholar) {
      return res.status(404).json({
        success: false,
        message: 'Scholar not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: scholar.timeline
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update scholar timeline
// @route   PUT /api/scholars/:id/timeline
// @access  Private/Admin
exports.updateScholarTimeline = async (req, res, next) => {
  try {
    const { timeline } = req.body;
    
    if (!timeline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide timeline data'
      });
    }
    
    const scholar = await Scholar.findByIdAndUpdate(
      req.params.id,
      { timeline },
      { new: true, runValidators: true }
    );
    
    if (!scholar) {
      return res.status(404).json({
        success: false,
        message: 'Scholar not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Timeline updated successfully',
      data: scholar.timeline
    });
  } catch (error) {
    next(error);
  }
};