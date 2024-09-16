// Import Express router
const router = require('express').Router();

// Import user-related controller functions
const {
  getAllUsers,   // Retrieves all users
  getUserById,   // Retrieves a single user by ID
  createUser,    // Creates a new user
  updateUser,    // Updates an existing user by ID
  deleteUser,    // Deletes a user by ID
  addFriend,     // Adds a friend to the user's friend list
  removeFriend   // Removes a friend from the user's friend list
} = require('../../../module-18-challenge-NoSQL-Challenge--Social-Network-API/controllers/user-controller');

// Route to handle retrieving all users and creating a new user
router
  .route('/')
  .get(getAllUsers)   // GET request to get all users
  .post(createUser);  // POST request to create a new user

// Route to handle retrieving, updating, and deleting a user by their ID
router
  .route('/:id')
  .get(getUserById)   // GET request to get a user by ID
  .put(updateUser)    // PUT request to update a user by ID
  .delete(deleteUser); // DELETE request to delete a user by ID

// Route to handle adding and removing friends from a user's friend list
router
  .route('/:userId/friends/:friendId')
  .post(addFriend)    // POST request to add a friend by friend ID
  .delete(removeFriend); // DELETE request to remove a friend by friend ID

// Export the router to be used in other parts of the application
module.exports = router;
