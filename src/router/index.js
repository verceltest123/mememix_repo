import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/Home.vue";
import Game from "../components/Game.vue";

const routes = [{
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/portfolio",
        name: "Portfolio",
        component: Portfolio,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;