<template>
	<ion-content>
		<ion-header>
			<ion-toolbar>
				<ion-title>Existing game servers</ion-title>
			</ion-toolbar>
		</ion-header>
		<div v-if="games?.length" class="mx-4">
			<div v-for="game in games" :key="game" class="flex justify-between p-1 mt-2 rounded-lg w-full bg-zinc-500 text-white">
				<p class="ml-2">Id: {{game.session}}</p>
				<ion-button @click="selectGame(game.session)">Play</ion-button>
			</div>
		</div>
		<div class="flex flex-col items-center" v-else>
			<p class="text-center">No games found!</p>
		</div>
		<ion-button class="w-full" @click="refresh">Refresh</ion-button>
	</ion-content>
</template>

<script>
import Axios from "axios";
import { modalController } from "@ionic/vue";

export default {
	data() {
		return {
			games: []
		}
	},

	methods: {
		selectGame(id) {
			return modalController.dismiss({
				id
			});
		},

		async refresh() {
			this.games = (await Axios.get(process.env.VUE_APP_API + "games")).data[0];
		}
	},

	async mounted() {
		this.refresh();
	}
}
</script>

<style lang="scss" scoped>

</style>