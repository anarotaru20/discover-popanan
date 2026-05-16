const supabase = require("../config/supabase");

async function getContributionsByLocation(locationId) {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("location_id", locationId)
    .eq("is_flagged", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function createContribution(payload) {
  const {
    location_id,
    name,
    type,
    message,
    source_url,
    image_url,
    is_flagged,
  } = payload;

  const { data, error } = await supabase
    .from("contributions")
    .insert([
      {
        location_id,
        name,
        type,
        message,
        source_url,
        image_url: image_url || [],
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
  getContributionsByLocation,
  createContribution,
};