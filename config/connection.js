const mongoose = require('mongoose');

// Establish a connection to the MongoDB database, using either a deployed MongoDB URI or a local instance.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetworkDB', {
    useNewUrlParser: true,  // Use the new URL parser to avoid deprecation warnings.
    useUnifiedTopology: true // Enables the new unified topology layer for Mongoose.
});

// Enable debugging mode to log MongoDB queries in the console for easier debugging during development.
mongoose.set('debug', true);

// Export the connection object to be used in the rest of the app.
module.exports = mongoose.connection;
