const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Public key for normal queries
// const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE; // Secret key for RLS bypass

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// const getSupabaseClient = (token) => {
//     return createClient(SUPABASE_URL, SUPABASE_KEY, {
//         global: { headers: { Authorization: `Bearer ${token}` } }
//     });
// };

module.exports = { supabase };
