const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

// Create a storage for multer to save the uploaded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Change this to the directory where you want to save the files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
// Create a multer middleware with the storage configuration
const upload = multer({ storage: storage });

// Authentication routes
router.post("/login", authController.login);
router.post("/signup", authController.signup);

// User profile routes
// router.use(authMiddleware);
// Apply authentication middleware to protect routes
router.get("/profile", usersController.getUserDetails);
router.patch("/profile", usersController.updateUser);
router.delete("/profile", usersController.deleteUser);
router.post("/editProfile", upload.single("cv"), usersController.editProfile);

module.exports = router;
