// Importing Mongoose to define the schema for users
const mongoose = require('mongoose');

// Defining the User schema with fields for username, email, thoughts, and friends
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Username must be unique across the database
    required: true, // Username is required
    trim: true // Trims whitespace from the username
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique
    match: [/.+@.+\..+/, 'Must match a valid email address'] // Validates email format
  },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to Thought model by ObjectId
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to other users by ObjectId
      ref: 'User'
    }
  ]
}, {
  toJSON: {
    virtuals: true // Include virtual fields when JSON is output
  },
  id: false // Disable virtual 'id' field to avoid confusion with '_id'
});

// Virtual property to get the number of friends
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length; // Returns the length of the friends array
});

// Create the User model based on the schema
const User = mongoose.model('User', UserSchema);

// Export the User model for use in other parts of the application
module.exports = User;
