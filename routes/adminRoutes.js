const express = require("express");
const router = express.Router();
const {
  addMainCategory,
  addImage,
  addSubcategory,
  addFilter,
} = require("../controllers/adminController");
const upload = require("../config/cloudinary");

router.post("/addImage", upload.single("image"), addImage);
router.post("/addMainCategory", addMainCategory);
router.post("/addSubcategory", addSubcategory);
router.post("/addFilter", addFilter);

module.exports = router;
