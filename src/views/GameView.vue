<template>
	<div class="flex justify-center items-center h-full">
		<ChessBoard v-if="game" class="lg:w-[50%] w-[90%]" v-bind="game" :api="api + 'game/'" @onTileClicked="onTileClicked" ref="chessBoard"></ChessBoard>
		<div class="flex flex-col items-center" v-else>
			<h1 class="text-9xl mb-32 text-center">Simple Chess</h1>
			<div class="flex flex-col items-center w-3/5">
				<ion-button class="w-full font-bold" @click="startGame(sessionInput)">{{sessionInput ? 'Join existing game' : 'Start new game'}}</ion-button>
				<ion-input v-model="sessionInput" class="rounded-md bg-slate-300 mt-3 ion-padding-horizontal" placeholder="Or enter token of game"></ion-input>
				<ion-button class="mt-10 font-bold w-7/12" @click="browseGames">Browse existing games</ion-button>
			</div>
		</div>
	</div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import GameBrowser from "@/components/GameBrowser.vue";
import Axios from "axios";

export default {
	components: {ChessBoard, GameBrowser},

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

			game: null,
			sessionInput: null,
			api: process.env.VUE_APP_API
		}
	},

	methods: {
		piece(color, name = "p", sprite = null) {
			return {name, color};
		},

		onGameClicked() {
			if (this.sessionInput)
				return startGame(this.sessionInput);
			return this.startNewGame();
		},

		async startGame(session = null) {
			try {
				if (session) 
					return this.game  = (await Axios.get(process.env.VUE_APP_API + "game/" + session)).data[0];

				const data = (await Axios.get(process.env.VUE_APP_API + "game/new")).data[0];
				return this.game = data;
			}
			catch (e) {
				this.toast(e, "danger");
			}
		},

		async browseGames() {
			this.gameBrowserModal = await this.modal(GameBrowser);

			const { data } = await this.gameBrowserModal.onDidDismiss();
			if (data)
				this.startGame(data.id);
		},

		onTileClicked(x, y) {
		
		}
	}
}
</script>