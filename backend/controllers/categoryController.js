const Category = require('../models/Category');
const Book = require('../models/Book');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const { 
      search,
      featured,
      sort = 'name'
    } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (featured === 'true') query.featured = true;
    
    // Apply text search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Determine sort direction (ascending or descending)
    let sortOption = {};
    if (sort.startsWith('-')) {
      sortOption[sort.substring(1)] = -1;
    } else {
      sortOption[sort] = 1;
    }
    
    // Execute query
    const categories = await Category.find(query)
      .sort(sortOption);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if there are any books in this category
    const booksCount = await Book.countDocuments({ category: req.params.id });
    
    if (booksCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${booksCount} books. Please reassign or delete the books first.`
      });
    }
    
    await category.remove();
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
exports.getFeaturedCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ featured: true })
      .sort('name');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update featured book for a category
// @route   PUT /api/categories/:id/featured-book
// @access  Private/Admin
exports.updateFeaturedBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a book ID'
      });
    }
    
    // Find the book to get its title
    const book = await Book.findById(bookId).select('title');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Update the category
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { 
        featuredBook: {
          book: bookId,
          title: book.title
        }
      },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Featured book updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get books in a category
// @route   GET /api/categories/:id/books
// @access  Public
exports.getCategoryBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ category: req.params.id })
      .select('title author scholar description coverImage downloads')
      .populate('scholar', 'name');
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};