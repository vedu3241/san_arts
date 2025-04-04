const express = require("express");
const router = express.Router();
const {
  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
} = require("../controllers/galleryController");

//routes
router.get("/getAllMainCategories", getAllMainCategories);
router.get("/:categoryId/getAllSubCategories", getAllSubCategories);
router.get("/:subCategoryId/getFilters", getFiltersBySubCategory);
router.get("/:subCategoryId/getImages", getImagesBySubcategory);

module.exports = router;
