import App from "./App.vue";
import "@/assets/scss/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "vue-multiselect/dist/vue-multiselect.css";

import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import { createVfm } from 'vue-final-modal'
const vfm = createVfm()

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vfm)
app.use(VueAwesomePaginate)
app.mount("#root");

export const useToast = (message, type) => {
    toast(message, {
        type,
        theme: "colored",
        position: "top-center",
        transition: "slide",
        dangerouslyHTMLString: true,
    });
}