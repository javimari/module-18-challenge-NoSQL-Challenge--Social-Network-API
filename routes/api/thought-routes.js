// Import Express router
const router = require('express').Router();

// Import necessary controller functions for thought operations
const {
  getAllThoughts,    // Retrieves all thoughts
  getThoughtById,    // Retrieves a single thought by ID
  createThought,     // Creates a new thought
  updateThought,     // Updates an existing thought by ID
  deleteThought,     // Deletes a thought by ID
  addReaction,       // Adds a reaction to a thought
  removeReaction     // Removes a reaction by ID
} = require('../../../module-18-challenge-NoSQL-Challenge--Social-Network-API/controllers/thought-controller');

// Route to handle retrieving all thoughts and creating a new thought
router
  .route('/')
  .get(getAllThoughts)  // GET request to get all thoughts
  .post(createThought); // POST request to create a new thought

// Route to handle retrieving, updating, and deleting a thought by its ID
router
  .route('/:id')
  .get(getThoughtById)   // GET request to get a thought by ID
  .put(updateThought)    // PUT request to update a thought by ID
  .delete(deleteThought); // DELETE request to delete a thought by ID

// Route to handle adding a reaction to a specific thought by its ID
router
  .route('/:thoughtId/reactions')
  .post(addReaction); // POST request to add a reaction to a thought

// Route to handle removing a reaction by its reaction ID from a thought
router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction); // DELETE request to remove a reaction by its ID

// Export the router to be used in other parts of the app
module.exports = router;
