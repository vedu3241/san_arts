const { supabase } = require("../config/supabase");

const addMainCategory = async (req, res) => {
  const { category_name, description } = req.body;
  const { data, error } = await supabase
    .from("main_categories")
    .insert([
      {
        category_name: category_name,
        description: description,
      },
    ])
    .select() // to return the inserted data
    .single();

  if (error) throw error;

  res.status(200).json(data);
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
  const { categoryId, subcategory_name, description } = req.body;

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

  if (error) throw error;

  res.status(200).json(data);
};

module.exports = { addMainCategory, addImage, addSubcategory };
