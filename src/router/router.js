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
      name: "FrameworkExample",
      component: () => import("../views/FrameworkExample.vue"),
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
      component: () => import("../views/IssueExample.vue"),
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
