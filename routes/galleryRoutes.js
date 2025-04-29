const express = require("express");
const router = express.Router();
const {
  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
  getFilteredImages
} = require("../controllers/galleryController");

//routes
router.get("/getAllMainCategories", getAllMainCategories);
router.get("/:categoryId/getAllSubCategories", getAllSubCategories);
router.get("/:subCategoryId/getFilters", getFiltersBySubCategory);
router.get("/:subCategoryId/getImages", getImagesBySubcategory);
router.post('/filter', getFilteredImages);

module.exports = router;
