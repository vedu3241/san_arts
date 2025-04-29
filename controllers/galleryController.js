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

// const getFilteredImages = async (req, res) => {
//   const { subcategory_id, filters } = req.body;

//   try {
//     let baseQuery = `
//       SELECT DISTINCT i.*
//       FROM art_images i
//       WHERE i.subcategory_id = $1
//     `;
//     let params = [subcategory_id];  // Subcategory ID is fine as it is
//     let paramIndex = 2;

//     // Apply dynamic filters
//     for (const [filterId, values] of Object.entries(filters)) {
//       // Ensure filterId is cast as a UUID and format the filter values as PostgreSQL array
//       const formattedValues = `{${values.join(',')}}`;  // Convert ["A1", "A2"] to '{A1,A2}'
//       baseQuery += `
//         AND EXISTS (
//           SELECT 1 
//           FROM filter_value fv
//           WHERE fv.img_id = i.id
//           AND fv.filter_id = $${paramIndex++}::uuid  -- Ensure filter_id is cast to UUID
//           AND fv.value = ANY($${paramIndex++}::text[])  -- Ensure values are cast to text[]
//         )
//       `;
//       params.push(filterId, formattedValues);  // Push filterId and formatted values to params
//     }

//     // Execute the query using raw SQL
//     const { data, error } = await supabase.rpc('exec_raw_sql', {
//       sql: baseQuery,
//       params,
//     });

//     if (error) return res.status(400).json({ error });

//     return res.json(data);
//   } catch (err) {
//     console.error('Gallery filter error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// Controller function for filtering images based on subcategory and dynamic filters

// Simplified approach using supabase's query builder with proper filter syntax

// 1. First update your execute_sql function in PostgreSQL:
/*
CREATE OR REPLACE FUNCTION execute_sql(query TEXT)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    EXECUTE 'WITH query_result AS (' || query || ') SELECT json_agg(row_to_json(query_result)) FROM query_result' INTO result;
    RETURN QUERY SELECT result;
END;
$$;
*/

// 2. Then update your Node.js function:
const getFilteredImages = async (req, res) => {
  const { subcategory_id, filters } = req.body;

  try {
    // Start with selecting all images in the subcategory
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



module.exports = {

  getAllMainCategories,
  getAllSubCategories,
  getFiltersBySubCategory,
  getImagesBySubcategory,
  getFilteredImages
};
