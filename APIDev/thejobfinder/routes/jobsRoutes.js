const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes for authenticated users
router.use(authMiddleware);

// GET /jobs
// Get all jobs
router.get('/', jobsController.getAllJobs);

// GET /jobs/:id
// Get a specific job
router.get('/id/:id', jobsController.getJobById);

// Get jobs by title
router.get('/:title', jobsController.getJobByTitle);

// POST /jobs
// Create a new job
router.post('/', jobsController.createJob);

// PUT /jobs/:id
// Update a job
router.put('/:id', jobsController.updateJob);

// DELETE /jobs/:id
// Delete a job
router.delete('/:id', jobsController.deleteJob);

module.exports = router;
