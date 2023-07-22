const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require("multer");

// Create a storage for multer to save the uploaded file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/logos/"); // Change this to the directory where you want to save the files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

  // Create a multer middleware with the storage configuration
const upload = multer({ storage: storage });
// Protected routes for authenticated users
// router.use(authMiddleware);

// GET /jobs
// Get all jobs
router.get('/', jobsController.getAllJobs);

// GET /jobs/:id
// Get a specific job
router.get('/id/:id', jobsController.getJobById);

// Get jobs by title
router.get('/getJob/:title', jobsController.getJobByTitle);

// POST /jobs
// Create a new job
router.post('/', upload.single("logo"),authMiddleware, jobsController.createJob);

// PUT /jobs/:id
// Update a job
router.put('/:id',authMiddleware, jobsController.updateJob);

// DELETE /jobs/:id
// Delete a job
router.delete('/:id',authMiddleware, jobsController.deleteJob);

// POST /jobs/:id/bookmark
router.post('/addBookmark/:id',authMiddleware, jobsController.bookmarkJob);

// DELETE /jobs/:id/bookmark
router.delete('/removeBookmark/:id',authMiddleware,  jobsController.unbookmarkJob);

// GET /jobs/getBookmarked
router.get('/getBookmarked',authMiddleware, jobsController.displayBookmarkedJobs);

router.get('/getAppliedJobs',authMiddleware, jobsController.getAppliedJobs);

router.post('/applyJob/:id',authMiddleware, jobsController.addAppliedJob);

router.post('/withdraw/:id',authMiddleware, jobsController.withdrawAppliedJob);

router.get('/user/:userId', authMiddleware, jobsController.getJobsByUserId);

module.exports = router;
