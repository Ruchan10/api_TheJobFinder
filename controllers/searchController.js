const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Job = require("../models/jobModel");

async function search(req, res) {
  console.log("INSIDE search function");
  try {
    const searchQuery = req.params.query;
    console.log(searchQuery);
    // Find jobs that have the search query in any of the relevant fields
    const jobs = await Job.find({
      $or: [
        { companyName: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { jobTime: { $regex: searchQuery, $options: "i" } },
        { jobTitle: { $regex: searchQuery, $options: "i" } },
        // Add more fields to search here, if needed
      ],
    });

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error in search" });
  }
}

async function filterCompanyName(req, res) {
  try {
    const { companyName, jobTitle, location, jobTime } = req.query;

    // Create an empty filter object to store the search criteria
    const filter = {};

    // Add search criteria for companyName if provided
    if (companyName) {
      filter["company"] = { $regex: companyName, $options: "i" };
    }

    // Add search criteria for jobTitle if provided
    if (jobTitle) {
      filter["title"] = { $regex: jobTitle, $options: "i" };
    }

    // Add search criteria for location if provided
    if (location) {
      filter["location"] = { $regex: location, $options: "i" };
    }

    // Add search criteria for jobTime if provided
    if (jobTime) {
      filter["time"] = { $regex: jobTime, $options: "i" };
    }

    // Perform the database query with the combined filter object
    const filteredJobs = await Job.find(filter);

    res.json({ success: true, data: filteredJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  search,
  filterCompanyName,
};
