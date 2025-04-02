const { supabase } = require("../config/supabase");
const getAllMainCategories = async (req, res) => {
  const { data: main_categories, error } = await supabase
    .from("main_categories")
    .select("*");

  if (error) throw error;

  res.status(200).json(main_categories);
};



module.exports = { getAllMainCategories };
