import api from "./api";

export async function getDailyStory() {
  const response = await api.get("/api/daily-story");

  return response.data;
}