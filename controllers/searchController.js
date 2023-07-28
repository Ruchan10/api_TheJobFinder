const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
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

module.exports = {
  search,
};
