const supabase = require("../config/supabase");

async function getCommentsByLocation(locationId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("location_id", locationId)
    .eq("is_flagged", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function createComment(payload) {
  const { location_id, name, message, is_flagged } = payload;

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        location_id,
        name,
        message,
        is_flagged,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  getCommentsByLocation,
  createComment,
};