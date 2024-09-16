// Import the User and Thought models
const { User, Thought } = require('../../Social-Network-API/models');

const userController = {
  // Retrieve all users from the database
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts', // Populate the 'thoughts' field, excluding the version key
        select: '-__v'
      })
      .populate({
        path: 'friends', // Populate the 'friends' field, excluding the version key
        select: '-__v'
      })
      .select('-__v') // Exclude version key from user data
      .then(dbUserData => res.json(dbUserData)) // Send response with all users
      .catch(err => {
        console.error('Error in getAllUsers:', err);
        res.status(400).json(err); // Handle errors
      });
  },

  // Retrieve a single user by ID
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .populate({
        path: 'thoughts', // Populate 'thoughts' field
        select: '-__v'
      })
      .populate({
        path: 'friends', // Populate 'friends' field
        select: '-__v'
      })
      .select('-__v') // Exclude version key from user data
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' }); // Handle case where no user is found
        }
        res.json(dbUserData); // Send response with user data
      })
      .catch(err => {
        console.error('Error in getUserById:', err);
        res.status(400).json(err); // Handle errors
      });
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then(dbUserData => res.json(dbUserData)) // Respond with the newly created user
      .catch(err => res.status(400).json(err)); // Handle validation or creation errors
  },

  // Update a user by ID
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id }, // Find user by ID
      req.body, // Update with request body data
      { new: true, runValidators: true } // Ensure validation and return updated data
    )
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData); // Respond with updated user data
      })
      .catch(err => res.status(400).json(err)); // Handle update errors
  },

  // Delete a user and associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        // Delete all thoughts associated with the user
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: 'User and associated thoughts deleted!' }); // Respond with success message
      })
      .catch(err => res.status(400).json(err)); // Handle deletion errors
  },

  // Add a friend to the user's friend list
  addFriend(req, res) {
    console.log('Adding friend:', req.params.friendId, 'to user:', req.params.userId);
    
    User.findOneAndUpdate(
      { _id: req.params.userId }, // Find user by ID
      { $addToSet: { friends: req.params.friendId } }, // Add friend to the friends array, avoiding duplicates
      { new: true, runValidators: true } // Return updated data and run validation
    )
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData); // Respond with updated user data
      })
      .catch(err => {
        console.error('Error in addFriend:', err);
        res.status(400).json(err); // Handle errors
      });
  },

  // Remove a friend from the user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, // Find user by ID
      { $pull: { friends: req.params.friendId } }, // Remove friend from the friends array
      { new: true } // Return updated data
    )
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData); // Respond with updated user data
      })
      .catch(err => res.status(400).json(err)); // Handle errors
  }
};

// Export the user controller for use in routes
module.exports = userController;
