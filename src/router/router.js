import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing,
    },
    {
      path: "/frameworks",
      name: "Frameworks",
      component: () => import("../views/Frameworks.vue"),
    },
    {
      path: "/frameworks/:id",
      name: "Example",
      component: () => import("../views/Example.vue"),
    },
    {
      path: "/issues",
      component: () => import("../views/Issues.vue"),
    },
    {
      path: "/experiments",
      component: () => import("../views/Experiments.vue"),
    },
  ],
});
