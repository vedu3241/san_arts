const express = require("express");
const router = express.Router();
const {
  addMainCategory,
  addImage,
  addSubcategory,
} = require("../controllers/adminController");
const upload = require("../config/cloudinary");

router.post("/addImage", upload.single("image"), addImage);
router.post("/addMainCategory", addMainCategory);
router.post("/addSubcategory", addSubcategory);

module.exports = router;
