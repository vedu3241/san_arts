const { supabase } = require("../config/supabase");
const getAllMainCategories = async (req, res) => {
  const { data: main_categories, error } = await supabase
    .from("main_categories")
    .select("*");

  if (error) throw error;

  res.status(200).json(main_categories);
};
const getAllSubCategories = async (req, res) => {
  const { categoryId } = req.params;

  const { data: subCategories, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("main_category_id", categoryId);

  if (error) throw error;

  res.status(200).json(subCategories);
};

const getFiltersBySubCategory = async (req, res) => {
  const { subCategoryId } = req.params;
  console.log(subCategoryId);

  const { data: filters, error } = await supabase
    .from("Filters")
    .select("*")
    .eq("subcategory_id", subCategoryId);

  if (error) throw error;

  res.status(200).json(filters);
};

const getImagesBySubcategory = async (req, res) => {
  const { subCategoryId } = req.params;

  const { data: imgData, error } = await supabase
    .from("art_images")
    .select("*")
    .eq("subcategory_id", subCategoryId);

  if (error) throw error;

  res.status(200).json(imgData);
};

module.exports = {
  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
};
