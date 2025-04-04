const { supabase } = require("../config/supabase");

const getAllMainCategories = async (req, res) => {
  try {
    const { data: main_categories, error } = await supabase
      .from("main_categories")
      .select("*");

    if (error) {
      console.error("Error fetching main categories:", error);
      return res.status(500).json({ error: "Error fetching main categories" });
    }

    res.status(200).json(main_categories);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getAllSubCategories = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const { data: subCategories, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("main_category_id", categoryId);

    if (error) {
      console.error("Error fetching subcategories:", error);
      return res.status(500).json({ error: "Error fetching subcategories" });
    }

    res.status(200).json(subCategories);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getFiltersBySubCategory = async (req, res) => {
  const { subCategoryId } = req.params;

  try {
    const { data: filters, error } = await supabase
      .from("Filters")
      .select("*")
      .eq("subcategory_id", subCategoryId);

    if (error) {
      console.error("Error fetching filters:", error);
      return res.status(500).json({ error: "Error fetching filters" });
    }

    res.status(200).json(filters);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getImagesBySubcategory = async (req, res) => {
  const { subCategoryId } = req.params;

  try {
    const { data: imgData, error } = await supabase
      .from("art_images")
      .select("*")
      .eq("subcategory_id", subCategoryId);

    if (error) {
      console.error("Error fetching images:", error);
      return res.status(500).json({ error: "Error fetching images" });
    }

    res.status(200).json(imgData);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = {
  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
};
