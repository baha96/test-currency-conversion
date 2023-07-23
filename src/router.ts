import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./pages/HomeView.vue";
import ConvertView from "./pages/ConvertView.vue";

export default createRouter({
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/convert/:currency",
      component: ConvertView,
    },
  ],
  history: createWebHistory(),
});
