import { createRouter, createWebHistory } from "@ionic/vue-router";
import GameView from "@/views/GameView.vue";
import HomeView from "@/views/HomeView.vue";
import Kokot from "@/views/Kokot.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: HomeView,
	},
	{
		path: "/game/:session",
		name: "Game",
		component: GameView,
	},
	{
		path: "/kokot",
		name: "Kokot",
		component: Kokot,
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router
