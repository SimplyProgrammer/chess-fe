import { createRouter, createWebHistory } from "@ionic/vue-router";
import HomeView from "@/views/HomeView.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: HomeView,
	},
	{
		path: "/game/:session",
		name: "Game",
		component: () => import("@/views/GameView.vue"),
	},
	{
		path: '/:catchAll(.*)',
		name: 'NotFound',
		component: () => import("@/views/NotFound.vue"),
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router
