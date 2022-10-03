<template>
	<div class="flex justify-center items-center h-full">
		<div class="flex flex-col items-center">
			<h1 class="text-9xl mb-32 text-center">Simple Chess</h1>
			<div class="flex flex-col items-center w-3/5">
				<ion-button class="w-full font-bold mb-10" @click="startGame(null, true)">{{'Singleplayer game'}}</ion-button>

				<ion-button class="w-full font-bold" @click="startGame(sessionInput)">{{sessionInput ? 'Join existing game' : 'Start game'}}</ion-button>
				<ion-input v-model="sessionInput" class="rounded-md bg-slate-300 mt-3 ion-padding-horizontal" placeholder="Or enter token of game" @dblclick="pasteText" ref="input"></ion-input>
				<!-- <ion-button class="mt-10 font-bold w-7/12" @click="browseGames">Browse existing games</ion-button> -->
			</div>
		</div>
	</div>
</template>

<script>
// import GameBrowser from "@/components/GameBrowser.vue";
import Axios from "axios";

export default {
	// components: {GameBrowser},

	data() {
		return {
			// defaltPieces: [
			// 	[this.piece(0, "r"), this.piece(0, "n"), this.piece(0, "b"), this.piece(0, "q"), this.piece(0, "k"), this.piece(0, "b"), this.piece(0, "n"), this.piece(0, "r")],
			// 	[this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0)],
			// 	[],
			// 	[],
			// 	[],
			// 	[],
			// 	[this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1)],
			// 	[this.piece(1, "r"), this.piece(1, "n"), this.piece(1, "b"), this.piece(1, "q"), this.piece(1, "k"), this.piece(1, "b"), this.piece(1, "n"), this.piece(1, "r")]
			// ],

			sessionInput: null,
		}
	},

	methods: {
		onGameClicked() {
			if (this.sessionInput)
				return startGame(this.sessionInput);
			return this.startNewGame();
		},

		async startGame(session = null, singleplayer = false) {
			try {
				if (session) 
					this.$router.push("/game/" + session);
				else {
					const data = (await Axios.get(process.env.VUE_APP_API + "game/join" + (singleplayer ? "?singleplayer=true" : ""))).data[0];
					console.log(data);
					this.$router.push("/game/" + data);
				}
			}
			catch (e) {
				this.toast(e, "danger");
			}
		},

		async pasteText() {
			this.sessionInput = await navigator.clipboard.readText();
		}

		// async browseGames() {
		// 	this.gameBrowserModal = await this.modal(GameBrowser);

		// 	const { data } = await this.gameBrowserModal.onDidDismiss();
		// 	if (data)
		// 		this.startGame(data.id);
		// },
	}
}
</script>