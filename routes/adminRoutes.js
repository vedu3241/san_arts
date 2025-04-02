const express = require("express");
const router = express.Router();
const { addMainCategory, addImage } = require("../controllers/adminController");
const upload = require("../config/cloudinary");

router.post("/addMainCategory", addMainCategory);
router.post("/addImage", upload.single("image"), addImage);

module.exports = router;
