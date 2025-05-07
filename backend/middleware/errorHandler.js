// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Server Error';
    
    // MongoDB duplicate key error
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
      
      // If it's a duplicate email or username, provide specific message
      if (err.keyValue && err.keyValue.email) {
        message = 'Email already exists';
      } else if (err.keyValue && err.keyValue.membershipId) {
        message = 'Membership ID already exists';
      }
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      
      // Extract all validation error messages
      message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    
    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };