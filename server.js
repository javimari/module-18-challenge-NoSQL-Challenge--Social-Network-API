// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3001;  // Define the port to listen on

// Configure Mongoose to use the strictQuery option
mongoose.set('strictQuery', false);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use custom routes from the routes module
app.use(routes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetworkDB')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
