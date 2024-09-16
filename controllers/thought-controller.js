// Import the Thought and User models from the database
const { Thought, User } = require('../../Social-Network-API/models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    console.log('getAllThoughts function called'); // Debugging log
    Thought.find({})
      .populate({
        path: 'reactions', // Populate reactions field, excluding the version key (__v)
        select: '-__v'
      })
      .select('-__v') // Exclude version key from thought
      .sort({ createdAt: -1 }) // Sort thoughts by creation date in descending order
      .then(dbThoughtData => {
        console.log('Thoughts retrieved:', dbThoughtData); // Debugging log
        res.json(dbThoughtData); // Return all thoughts in JSON format
      })
      .catch(err => {
        console.error('Error in getAllThoughts:', err); // Log errors
        res.status(500).json({ message: 'Server error', error: err.toString() }); // Respond with error status
      });
  },

  // Get a single thought by its ID
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({
        path: 'reactions', // Populate reactions field
        select: '-__v'
      })
      .select('-__v') // Exclude version key from thought
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' }); // Handle no matching thought
        }
        res.json(dbThoughtData); // Return thought data
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err); // Respond with error status
      });
  },

  // Create a new thought and associate it with a user
  createThought(req, res) {
    let createdThought;
    Thought.create(req.body)
      .then(dbThoughtData => {
        createdThought = dbThoughtData; // Store created thought
        return User.findOneAndUpdate(
          { _id: req.body.userId }, // Find user by ID and add thought ID to their thoughts array
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created but no user found with this id!' });
        }
        res.json({ message: 'Thought successfully created!', thought: createdThought }); // Respond with success message
      })
      .catch(err => {
        console.error('Error in createThought:', err);
        res.status(400).json({ message: 'Error creating thought', error: err.toString() }); // Handle creation errors
      });
  },

  // Update thought by its ID
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id }, // Find thought by ID
      req.body, // Update thought data
      { new: true, runValidators: true } // Return the updated thought and run validation
    )
      .populate({
        path: 'reactions', // Populate reactions field
        select: '-__v'
      })
      .select('-__v') // Exclude version key from thought
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' }); // Handle no matching thought
        }
        res.json(dbThoughtData); // Return updated thought data
      })
      .catch(err => res.status(400).json(err)); // Handle update errors
  },

  // Delete a thought by its ID
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' }); // Handle no matching thought
        }
        // Remove the thought ID from the associated user's thoughts array
        return User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought deleted but no user found with this thought id!' });
        }
        res.json({ message: 'Thought successfully deleted!' }); // Respond with success message
      })
      .catch(err => res.status(500).json(err)); // Handle deletion errors
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, // Find thought by ID
      { $push: { reactions: req.body } }, // Add reaction to the reactions array
      { new: true, runValidators: true } // Return updated thought and run validation
    )
      .populate({
        path: 'reactions', // Populate reactions field
        select: '-__v'
      })
      .select('-__v') // Exclude version key from thought
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' }); // Handle no matching thought
        }
        res.json(dbThoughtData); // Return updated thought with new reaction
      })
      .catch(err => res.status(400).json(err)); // Handle addition errors
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, // Find thought by ID
      { $pull: { reactions: { reactionId: req.params.reactionId } } }, // Remove the reaction by its ID
      { new: true, runValidators: true } // Return updated thought and run validation
    )
      .populate({
        path: 'reactions', // Populate reactions field
        select: '-__v'
      })
      .select('-__v') // Exclude version key from thought
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' }); // Handle no matching thought
        }
        // Check if reaction was actually removed
        const reactionRemoved = !dbThoughtData.reactions.some(reaction => 
          reaction.reactionId.toString() === req.params.reactionId
        );
        if (reactionRemoved) {
          res.json(dbThoughtData); // Respond with updated thought data
        } else {
          return res.status(404).json({ message: 'No reaction found with this id!' });
        }
      })
      .catch(err => res.status(400).json(err)); // Handle removal errors
  }
};

// Export the thoughtController to be used in routes
module.exports = thoughtController;
