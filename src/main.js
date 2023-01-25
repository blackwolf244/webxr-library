import { createApp } from "vue";

import "./normalize.css";
import "./skeleton.css";
import "./app.css";
import App from "./App.vue";
import router from "./router/router";
import moshaToast from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

createApp(App).use(router, moshaToast).mount("#app");
