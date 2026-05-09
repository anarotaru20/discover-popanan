import { defineStore } from "pinia";

import { getDailyStory } from "@/services/dailyStory";

export const useDailyStoryStore = defineStore("dailyStory", {
  state: () => ({
    story: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDailyStory() {
      try {
        this.loading = true;
        this.error = null;

        const data = await getDailyStory();

        this.story = data.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});