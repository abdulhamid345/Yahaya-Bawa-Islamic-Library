const User = require('../models/User');
const Book = require('../models/Book');
const Scholar = require('../models/Scholar');
const Category = require('../models/Category');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts of various entities
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    const scholarCount = await Scholar.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    // Get recent registrations
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort('-createdAt')
      .limit(5);
    
    // Get top downloaded books
    const topBooks = await Book.find()
      .select('title author downloads')
      .sort('-downloads')
      .limit(5);
    
    // Get recent activities (simplified version)
    const recentBooks = await Book.find()
      .select('title author createdAt')
      .sort('-createdAt')
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          books: bookCount,
          scholars: scholarCount,
          categories: categoryCount
        },
        recentUsers,
        topBooks,
        recentActivities: recentBooks.map(book => ({
          type: 'book_added',
          title: book.title,
          timestamp: book.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage scholars from admin dashboard
// @route   GET /api/admin/scholars
// @access  Private/Admin
exports.getScholarsAdmin = async (req, res, next) => {
  try {
    const scholars = await Scholar.find()
      .select('name description image specialties featured')
      .sort('name');
    
    // For each scholar, get book count
    const scholarsWithBookCount = await Promise.all(
      scholars.map(async (scholar) => {
        const bookCount = await Book.countDocuments({ scholar: scholar._id });
        return {
          ...scholar.toObject(),
          bookCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: scholars.length,
      data: scholarsWithBookCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get books by scholar for admin dashboard
// @route   GET /api/admin/scholars/:scholarId/books
// @access  Private/Admin
exports.getScholarBooksAdmin = async (req, res, next) => {
  try {
    const { scholarId } = req.params;
    
    // Check if scholar exists
    const scholar = await Scholar.findById(scholarId);
    
    if (!scholar) {
      return res.status(404).json({
        success: false,
        message: 'Scholar not found'
      });
    }
    
    // Get books for this scholar
    const books = await Book.find({ scholar: scholarId })
      .select('title category description downloads featured')
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

// @desc    Admin dashboard management for categories
// @route   GET /api/admin/categories
// @access  Private/Admin
exports.getCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort('name');
    
    // For each category, get book count
    const categoriesWithData = await Promise.all(
      categories.map(async (category) => {
        const bookCount = await Book.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          actualBookCount: bookCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categoriesWithData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name email role membershipId phoneNumber address createdAt')
      .sort('-createdAt');
    
    // For each user, get borrowed book count
    const usersWithData = await Promise.all(
      users.map(async (user) => {
        const borrowedBookCount = user.borrowedBooks ? user.borrowedBooks.length : 0;
        return {
          ...user.toObject(),
          borrowedBookCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: usersWithData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books for admin management
// @route   GET /api/admin/books
// @access  Private/Admin
exports.getBooksAdmin = async (req, res, next) => {
  try {
    const books = await Book.find()
      .select('title author scholar category language publishedYear downloads featured availableCopies totalCopies')
      .populate('scholar', 'name')
      .populate('category', 'name')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set featured items (books, scholars, categories)
// @route   PUT /api/admin/featured/:type/:id
// @access  Private/Admin
exports.setFeaturedItem = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { featured } = req.body;
    
    if (featured === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Featured status is required'
      });
    }
    
    let result;
    
    switch (type) {
      case 'book':
        result = await Book.findByIdAndUpdate(
          id,
          { featured },
          { new: true }
        );
        break;
      case 'scholar':
        result = await Scholar.findByIdAndUpdate(
          id,
          { featured },
          { new: true }
        );
        break;
      case 'category':
        result = await Category.findByIdAndUpdate(
          id,
          { featured },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Must be book, scholar, or category'
        });
    }
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `${type} featured status updated successfully`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get borrowing history for admin
// @route   GET /api/admin/borrowings
// @access  Private/Admin
exports.getBorrowingHistory = async (req, res, next) => {
  try {
    // Get all users with borrowed books
    const users = await User.find({ 'borrowedBooks.0': { $exists: true } })
      .select('name email membershipId borrowedBooks borrowingHistory')
      .populate({
        path: 'borrowedBooks.book',
        select: 'title author'
      });
    
    // Format the response data
    const borrowings = users.flatMap(user => {
      return user.borrowingHistory.map(history => ({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          membershipId: user.membershipId
        },
        book: history.book,
        borrowDate: history.borrowDate,
        returnDate: history.returnDate,
        status: history.status
      }));
    });
    
    // Sort by borrow date, most recent first
    borrowings.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
    
    res.status(200).json({
      success: true,
      count: borrowings.length,
      data: borrowings
    });
  } catch (error) {
    next(error);
  }
};