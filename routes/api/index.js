// Combines all API routes

const router = require('express').Router();
const userRoutes = require('../../../Social-Network-API/routes/api/user-routes');
const thoughtRoutes = require('../../../Social-Network-API/routes/api/thought-routes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;

