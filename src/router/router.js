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
      path: "/devtools",
      name: "Devtools",
      component: () => import("../views/Devtools.vue"),
    },
    {
      path: "/devtools/:id",
      name: "DevtoolsExample",
      component: () => import("../views/DevtoolExample.vue"),
    },
    {
      path: "/issues",
      component: () => import("../views/Issues.vue"),
    },
    {
      path: "/issues/:id/solution",
      name: "Solution",
      component: () => import("../views/Solution.vue"),
    },
    {
      path: "/issues/:id/example",
      name: "IssueExample",
      component: () => import("../views/Example.vue"),
    },
    {
      path: "/experiments",
      component: () => import("../views/Experiments.vue"),
    },
    {
      path: "/experiments/:id",
      name: "Experiments",
      component: () => import("../views/Issues.vue"),
    },
  ],
});
