import { createApp } from "vue";

import "./normalize.css";
import "./skeleton.css";
import "./app.css";
import App from "./App.vue";
import router from "./router/router";

import "aframe";

createApp(App).use(router).mount("#app");
