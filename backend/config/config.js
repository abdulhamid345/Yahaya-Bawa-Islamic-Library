const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/yahaya_bawa_library',
  
  // File Upload Configuration
  uploadPath: {
    books: 'uploads/books',
    images: 'uploads/images'
  },
  
  // Maximum file sizes for uploads (in bytes)
  maxFileSize: {
    books: 25 * 1024 * 1024, // 25MB
    images: 5 * 1024 * 1024  // 5MB
  },
  
  // Allowed file types
  allowedFileTypes: {
    books: ['.pdf', '.epub', '.doc', '.docx'],
    images: ['.jpg', '.jpeg', '.png', '.gif']
  }
};