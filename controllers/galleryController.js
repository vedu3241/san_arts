const { supabase } = require("../config/supabase");

const getAllMainCategories = async (req, res) => {
  try {
    console.log("Fetching main categories...");
    // Fetch all main categories from the database

    const { data: main_categories, error } = await supabase
      .from("main_categories")
      .select("*");

    // Check for errors in the query

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
  console.log("categoryId", subCategoryId);
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

//OR filter
const getFilteredImages = async (req, res) => {
  const { subcategory_id, filters } = req.body;

  try {

    let { data: allImages, error: initialError } = await supabase
      .from('art_images')
      .select('*')
      .eq('subcategory_id', subcategory_id);

    if (initialError) {
      console.error('Initial query error:', initialError);
      return res.status(400).json({ error: initialError });
    }

    // If filters are provided
    if (filters && Object.keys(filters).length > 0) {
      let allMatchingIds = new Set();

      for (const [filterId, values] of Object.entries(filters)) {
        if (values && values.length > 0) {
          const { data: matchingImages, error: filterError } = await supabase
            .from('filter_value')
            .select('img_id')
            .eq('filter_id', filterId)
            .in('value', values);

          if (filterError) {
            console.error('Filter query error:', filterError);
            return res.status(400).json({ error: filterError });
          }

          matchingImages.forEach(img => allMatchingIds.add(img.img_id));
        }
      }

      // Keep only images whose ID is in the union of all matching image IDs
      const filteredImages = allImages.filter(img => allMatchingIds.has(img.id));

      // Sort by creation date
      filteredImages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return res.json(filteredImages || []);
    }

    // If no filters, return all subcategory images sorted
    allImages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return res.json(allImages || []);
  } catch (err) {
    console.error('Gallery filter error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

//AND  filter
// const getFilteredImages = async (req, res) => {
//   const { subcategory_id, filters } = req.body;

//   try {
//     // Start with selecting all images in the subcategory
//     let { data: filteredImages, error: initialError } = await supabase
//       .from('art_images')
//       .select('*')
//       .eq('subcategory_id', subcategory_id);

//     if (initialError) {
//       console.error('Initial query error:', initialError);
//       return res.status(400).json({ error: initialError });
//     }

//     // If we have filters, apply them by fetching matching image IDs first
//     if (filters && Object.keys(filters).length > 0) {
//       // For each filter type
//       for (const [filterId, values] of Object.entries(filters)) {
//         if (values && values.length > 0) {
//           // Get all image IDs that match this filter
//           const { data: matchingImages, error: filterError } = await supabase
//             .from('filter_value')
//             .select('img_id')
//             .eq('filter_id', filterId)
//             .in('value', values);

//           if (filterError) {
//             console.error('Filter query error:', filterError);
//             return res.status(400).json({ error: filterError });
//           }

//           // Extract the matching image IDs
//           const matchingImageIds = matchingImages.map(img => img.img_id);

//           // Filter our current results to only include images that match this filter
//           filteredImages = filteredImages.filter(img =>
//             matchingImageIds.includes(img.id)
//           );
//         }
//       }

//     }

//     // Sort results by creation date (newest first)
//     filteredImages.sort((a, b) =>
//       new Date(b.created_at) - new Date(a.created_at)
//     );

//     return res.json(filteredImages || []);
//   } catch (err) {
//     console.error('Gallery filter error:', err);
//     return res.status(500).json({ message: 'Server error', details: err.message });
//   }
// };


module.exports = {

  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
  getFilteredImages
};
