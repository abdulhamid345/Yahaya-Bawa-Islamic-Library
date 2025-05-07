const Book = require('../models/Book');
const Category = require('../models/Category');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const fs = require('fs');
const path = require('path');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const { 
      category, 
      scholar,
      language, 
      available,
      search,
      featured,
      page = 1,
      limit = 10,
      sort = 'title'
    } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (category) query.category = category;
    if (scholar) query.scholar = scholar;
    if (language) query.language = language;
    if (available === 'true') query.availableCopies = { $gt: 0 };
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
    
    // If sorting by text relevance
    if (search && sort === 'relevance') {
      sortOption = { score: { $meta: 'textScore' } };
    }
    
    // Execute query with pagination
    const books = await Book.find(query)
      .select('title author scholar category language description coverImage downloads featured')
      .populate('scholar', 'name')
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: books.length,
      total: totalBooks,
      totalPages: Math.ceil(totalBooks / parseInt(limit)),
      currentPage: parseInt(page),
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('scholar', 'name')
      .populate('category', 'name');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
  try {
    // Extract book data from request body
    const bookData = { ...req.body };
    
    // Add file paths if files were uploaded
    if (req.files) {
      if (req.files.coverImage) {
        bookData.coverImage = `/uploads/images/${req.files.coverImage[0].filename}`;
      }
      
      if (req.files.bookFile) {
        bookData.fileUrl = `/uploads/books/${req.files.bookFile[0].filename}`;
      }
    }
    
    // Create the book
    const book = await Book.create(bookData);
    
    // Update category book count
    await Category.findByIdAndUpdate(
      book.category,
      { $inc: { bookCount: 1 } }
    );
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    // If an error occurs and files were uploaded, delete them
    if (req.files) {
      if (req.files.coverImage) {
        fs.unlinkSync(req.files.coverImage[0].path);
      }
      
      if (req.files.bookFile) {
        fs.unlinkSync(req.files.bookFile[0].path);
      }
    }
    
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Extract book data from request body
    const bookData = { ...req.body };
    
    // Add file paths if files were uploaded
    if (req.files) {
      // Handle cover image upload
      if (req.files.coverImage) {
        // Delete old cover image if it exists
        if (book.coverImage) {
          const oldPath = path.join(__dirname, '..', book.coverImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        
        bookData.coverImage = `/uploads/images/${req.files.coverImage[0].filename}`;
      }
      
      // Handle book file upload
      if (req.files.bookFile) {
        // Delete old book file if it exists
        if (book.fileUrl) {
          const oldPath = path.join(__dirname, '..', book.fileUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        
        bookData.fileUrl = `/uploads/books/${req.files.bookFile[0].filename}`;
      }
    }
    
    // Handle category change
    if (bookData.category && bookData.category !== book.category.toString()) {
      // Decrement old category count
      await Category.findByIdAndUpdate(
        book.category,
        { $inc: { bookCount: -1 } }
      );
      
      // Increment new category count
      await Category.findByIdAndUpdate(
        bookData.category,
        { $inc: { bookCount: 1 } }
      );
    }
    
    // Update the book
    book = await Book.findByIdAndUpdate(
      req.params.id,
      bookData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    // If an error occurs and files were uploaded, delete them
    if (req.files) {
      if (req.files.coverImage) {
        fs.unlinkSync(req.files.coverImage[0].path);
      }
      
      if (req.files.bookFile) {
        fs.unlinkSync(req.files.bookFile[0].path);
      }
    }
    
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Delete associated files
    if (book.coverImage) {
      const coverPath = path.join(__dirname, '..', book.coverImage);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    if (book.fileUrl) {
      const filePath = path.join(__dirname, '..', book.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Decrement category book count
    await Category.findByIdAndUpdate(
      book.category,
      { $inc: { bookCount: -1 } }
    );
    
    // Delete associated chapters
    await Chapter.deleteMany({ book: book._id });
    
    // Delete the book
    await book.remove();
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
exports.getFeaturedBooks = async (req, res, next) => {
  try {
    const featuredBooks = await Book.find({ featured: true })
      .select('title author scholar description coverImage downloads')
      .populate('scholar', 'name')
      .populate('category', 'name')
      .limit(6);
    
    res.status(200).json({
      success: true,
      count: featuredBooks.length,
      data: featuredBooks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get books by scholar
// @route   GET /api/books/scholar/:scholarId
// @access  Public
exports.getBooksByScholar = async (req, res, next) => {
  try {
    const { scholarId } = req.params;
    const books = await Book.find({ scholar: scholarId })
      .select('title description category downloads publishedYear')
      .populate('category', 'name');
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get books by category
// @route   GET /api/books/category/:categoryId
// @access  Public
exports.getBooksByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const books = await Book.find({ category: categoryId })
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

// @desc    Download a book
// @route   GET /api/books/:id/download
// @access  Public
exports.downloadBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (!book.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'No downloadable file for this book'
      });
    }
    
    // Increment download count
    book.downloads += 1;
    await book.save();
    
    // Get the file path
    const filePath = path.join(__dirname, '..', book.fileUrl);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Book file not found'
      });
    }
    
    // Send the file
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    const books = await Book.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .select('title author scholar category description coverImage downloads')
      .populate('scholar', 'name')
      .populate('category', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chapters for a book
// @route   GET /api/books/:id/chapters
// @access  Public
exports.getBookChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.find({ book: req.params.id })
      .select('title arabicTitle orderNumber pages')
      .sort('orderNumber');
    
    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific chapter of a book
// @route   GET /api/books/:id/chapters/:chapterId
// @access  Public
exports.getChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findOne({
      book: req.params.id,
      _id: req.params.chapterId
    });
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a chapter to a book
// @route   POST /api/books/:id/chapters
// @access  Private/Admin
exports.addBookChapter = async (req, res, next) => {
  try {
    // Check if book exists
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Create new chapter
    const chapter = await Chapter.create({
      ...req.body,
      book: req.params.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Chapter added successfully',
      data: chapter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a chapter
// @route   PUT /api/books/:id/chapters/:chapterId
// @access  Private/Admin
exports.updateChapter = async (req, res, next) => {
  try {
    let chapter = await Chapter.findOne({
      book: req.params.id,
      _id: req.params.chapterId
    });
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    chapter = await Chapter.findByIdAndUpdate(
      req.params.chapterId,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Chapter updated successfully',
      data: chapter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a chapter
// @route   DELETE /api/books/:id/chapters/:chapterId
// @access  Private/Admin
exports.deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findOne({
      book: req.params.id,
      _id: req.params.chapterId
    });
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    await chapter.remove();
    
    res.status(200).json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};