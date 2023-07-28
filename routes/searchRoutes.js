const express = require("express");
const searchController = require("../controllers/searchController");

const router = express.Router();

router.post("/mainSearch/:query", searchController.search);
module.exports = router;
