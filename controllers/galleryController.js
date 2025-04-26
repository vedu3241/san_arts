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

//without pagination
// const getImagesBySubcategory = async (req, res) => {
//   const { subCategoryId } = req.params;

//   try {
//     const { data: imgData, error } = await supabase
//       .from("art_images")
//       .select(
//         `
//         id,
//         img_url,
//         img_title,
//         description,
//         created_at,
//         main_categories(category_name),
//         subcategories(subcategory_name)
//       `
//       )
//       .eq("subcategory_id", subCategoryId);

//     if (error) {
//       console.error("Error fetching images:", error);
//       return res.status(500).json({ error: "Error fetching images" });
//     }

//     res.status(200).json(imgData);
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     res.status(500).json({ error: "An unexpected error occurred" });
//   }
// };

//with pagination
const getImagesBySubcategory = async (req, res) => {
  const { subCategoryId } = req.params;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page

  // Calculate pagination range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const {
      data: imgData,
      count,
      error,
    } = await supabase
      .from("art_images")
      .select(
        `
        id, 
        img_url, 
        img_title, 
        description, 
        created_at,
        main_categories(category_name),
        subcategories(subcategory_name)
      `,
        { count: "exact" } // This ensures count is returned
      )
      .eq("subcategory_id", subCategoryId)
      .range(from, to); // Apply pagination

    if (error) {
      console.error("Error fetching images:", error);
      return res.status(500).json({ error: "Error fetching images" });
    }

    res.status(200).json({
      page,
      pageSize,
      totalRecords: count || 0, // Handle case where count might be null
      totalPages: Math.ceil((count || 0) / pageSize),
      data: imgData,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getImagesByFilter = async (req, res) => {
  const { filterVal } = req.params;

  try {
    const { data: imgData, error } = await supabase
      .from("filter_value")
      .select(
        `filter_id,
        art_images(
          img_url,
          main_category_id,
          subcategory_id,
          img_title,
          description,
          created_at
        )`
      )
      .eq("value", filterVal);

    if (error) throw error;

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
  getImagesByFilter,
};
