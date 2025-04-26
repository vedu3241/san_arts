const express = require("express");
const router = express.Router();
const {
  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
  getImagesByFilter
} = require("../controllers/galleryController");

//routes
router.get("/getAllMainCategories", getAllMainCategories);
router.get("/:categoryId/getAllSubCategories", getAllSubCategories);
router.get("/:subCategoryId/getFilters", getFiltersBySubCategory);
router.get("/:subCategoryId/getImages", getImagesBySubcategory);
router.get("/filter/:filterVal", getImagesByFilter);

module.exports = router;
