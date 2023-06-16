const Job = require('../models/jobModel');
const jobsService = require('../services/jobsService');

// Get all jobs
async function getAllJobs(req, res) {
  try {
    const jobs = await jobsService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error in jobsController/ getAllJobs function' });
  }
}

// Get a single job by ID
async function getJobById(req, res) {
  try {
    const jobId = req.params.id;
    const job = await jobsService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error in getJobById Function' });
  }
}
// Get a single job by title
async function getJobByTitle(req, res) {
    console.log("Inside getJobByTitle function")
    try {
      const jobTitle = req.params.title;
      const job = await jobsService.getJobByTitle(jobTitle);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error in getJobByTitle function' });
    }
  }
  

async function createJob(req, res) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized Access' });
      }
  
      const { title, description, company, location } = req.body;
      const newJob = new Job({
        title,
        description,
        company,
        location,
        postedBy: req.user._id, // Assign the authenticated user's ID to postedBy
      });
  // Add user in the database
      const createdJob = await newJob.save();

      res.status(201).json({ message: 'Job created successfully', job: createdJob });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error in createJob fucntion' });
    }
  }
  
  

// Update a job by ID
async function updateJob(req, res) {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized Access' });
    }

    const jobId = req.params.id;
    const { title, description, company,location } = req.body;

    // Check if the authenticated user owns the job
    const job = await jobsService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedJob = await jobsService.updateJob(jobId, {
      title,
      description,
      company,
      location,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error in getJobById function' });
  }
}

// Delete a job by ID
async function deleteJob(req, res) {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized Access' });
    }

    const jobId = req.params.id;

    // Check if the authenticated user owns the job
    const job = await jobsService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await jobsService.deleteJob(jobId);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error in deleteJob function' });
  }
}

module.exports = {
  getAllJobs,
  getJobById,
  getJobByTitle,
  createJob,
  updateJob,
  deleteJob,
};
