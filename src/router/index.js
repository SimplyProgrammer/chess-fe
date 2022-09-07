import { createRouter, createWebHistory } from "@ionic/vue-router";
import GameView from "../views/GameView.vue";

const routes = [
	{
		path: "",
		redirect: "/game"
	},
	{
		path: "/game",
		component: GameView,
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router
