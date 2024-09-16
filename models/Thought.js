// Importing Mongoose for creating schemas and a custom date formatting utility
const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Define the schema for reactions, which are subdocuments within thoughts
const ReactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Schema.Types.ObjectId, // Unique identifier for each reaction
    default: () => new mongoose.Types.ObjectId() // Automatically generate a new ObjectId
  },
  reactionBody: {
    type: String,
    required: true, // Reaction body must be provided
    maxlength: 280 // Limit the length of the reaction to 280 characters
  },
  username: {
    type: String,
    required: true // Username of the person creating the reaction is mandatory
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date/time
    get: timestamp => dateFormat(timestamp) // Use a getter to format the date
  }
});

// Define the schema for thoughts, which include text, username, and an array of reactions
const ThoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true, // Thought content is required
    minlength: 1, // Must have at least 1 character
    maxlength: 280 // Cannot exceed 280 characters
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default timestamp when thought is created
    get: timestamp => dateFormat(timestamp) // Format the timestamp using custom dateFormat
  },
  username: {
    type: String,
    required: true // The username of the thought creator is required
  },
  reactions: [ReactionSchema] // Embed an array of ReactionSchema objects as subdocuments
},
{
  toJSON: {
    virtuals: true, // Include virtual properties when converting to JSON
    getters: true // Apply getter functions, such as date formatting
  },
  id: false // Disable the virtual 'id' field
});

// Virtual property to get the count of reactions for a thought
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length; // Returns the length of the reactions array
});

// Create the Thought model based on the ThoughtSchema
const Thought = mongoose.model('Thought', ThoughtSchema);

// Export the Thought model for use in other parts of the application
module.exports = Thought;
