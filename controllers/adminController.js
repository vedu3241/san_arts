const { supabase } = require("../config/supabase");

const addMainCategory = async (req, res) => {
  // Extract category name and description from the request body
  const { category_name, description } = req.body;

  // Check if required fields are present
  if (!category_name || !description) {
    return res
      .status(400)
      .json({ message: "Category name and description are required." });
  }

  try {
    // Insert data into the "main_categories" table
    const { data, error } = await supabase
      .from("main_categories")
      .insert([
        {
          category_name: category_name,
          description: description,
        },
      ])
      .select() // To return the inserted data
      .single(); // We are expecting a single object to be returned

    // Check for any errors returned by Supabase
    if (error) {
      return res
        .status(500)
        .json({ message: "Error inserting category", error: error.message });
    }

    // If everything went well, return the inserted data
    res.status(201).json(data);
  } catch (err) {
    // Catch any unexpected errors
    res
      .status(500)
      .json({ message: "Unexpected error occurred", error: err.message });
  }
};

// Image upload endpoint
const addImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const { img_title, description, main_category_id, subcategory_id } =
      req.body;

    const { data, error } = await supabase
      .from("art_images")
      .insert([
        {
          img_title: img_title,
          img_url: req.file.path,
          description: description,
          main_category_id: main_category_id,
          subcategory_id: subcategory_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting data:", error);
      return { status: 500, message: "Failed to insert data" };
    }

    // Return the Cloudinary response which includes image details
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: data,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};

const addSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategory_name, description } = req.body;

    // Check for required fields
    if (!categoryId || !subcategory_name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("subcategories")
      .insert([
        {
          main_category_id: categoryId,
          subcategory_name: subcategory_name,
          description: description,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Return success response
    res.status(200).json(data);
  } catch (err) {
    console.error("Error adding subcategory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addFilter = async (req, res) => {
  try {
    const { filter_name, description, values, subcategory_id } = req.body;

    if (!filter_name || !values || !subcategory_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: newFilter, error } = await supabase
      .from("Filters")
      .insert([
        {
          filter_name: filter_name,
          values: values, // Array of values
          subcategory_id: subcategory_id,
          description: description,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(newFilter);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the filter." });
  }
};

module.exports = { addMainCategory, addImage, addSubcategory, addFilter };
