import { createRouter, createWebHistory } from "vue-router";

import LandingView from "@/views/LandingView.vue";
import MapView from "@/views/MapView.vue";
import ToursView from "@/views/ToursView.vue";
import TourDetailsView from "@/views/TourDetailsView.vue";
import LocationDetailsView from "@/views/LocationDetailsView.vue";
import AboutView from "@/views/AboutView.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingView,
  },
  {
    path: "/map",
    name: "map",
    component: MapView,
  },
  {
    path: "/tours",
    name: "tours",
    component: ToursView,
  },
  {
    path: "/tours/:slug",
    name: "tour-details",
    component: TourDetailsView,
  },
  {
    path: "/location/:slug",
    name: "location-details",
    component: LocationDetailsView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;