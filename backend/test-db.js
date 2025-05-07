// test-db.js
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Log the MongoDB URI (but mask the password for security)
const displayUri = process.env.MONGO_URI ? 
  process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
  'undefined';
console.log('Using MongoDB URI:', displayUri);

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully!');
  mongoose.disconnect();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});