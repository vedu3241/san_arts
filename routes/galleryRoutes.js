const express = require("express");
const router = express.Router();
const { getAllMainCategories } = require("../controllers/galleryController");

//routes
router.get("/getAllMainCategories", getAllMainCategories);
// router.get("/")

module.exports = router;
