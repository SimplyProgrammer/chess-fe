<template>
	<ion-content>
		<div class="flex justify-center items-center h-full">
			<div class="w-full h-full" v-if="game">
				<p class="text-center bg-slate-600 text-white border-0 border-black border-solid border-b-4 m-0 py-1" @dblclick="copySessionId">{{game.session}}</p>
				<div class="flex justify-center items-center h-[90%]">
					<ChessBoard v-if="game" class="lg:w-[46%] w-[90%]" v-bind="game" 
						:moveUrl="api + 'game/' + game.session + '/move'" 
						:movmentMetrixUrl="api + 'game/' + game.session + '/movmentMetrix'"
						@onTileClicked="onTileClicked" ref="chessBoard">
					</ChessBoard>
				</div>
				<footer class="absolute bottom-0 flex justify-between w-full border-2 border-black border-solid">
					<p class="bg-black text-white m-0 h-12 w-full">Black</p>
					<p class="text-black m-0 h-12 w-full">White</p>
				</footer>
			</div>
			<div class="flex flex-col items-center" v-else>
				<h1 class="text-9xl mb-32 text-center">Simple Chess</h1>
				<div class="flex flex-col items-center w-3/5">
					<ion-button class="w-full font-bold" @click="startGame(sessionInput)">{{sessionInput ? 'Join existing game' : 'Start new game'}}</ion-button>
					<ion-input v-model="sessionInput" class="rounded-md bg-slate-300 mt-3 ion-padding-horizontal" placeholder="Or enter token of game"></ion-input>
					<ion-button class="mt-10 font-bold w-7/12" @click="browseGames">Browse existing games</ion-button>
				</div>
			</div>
		</div>
	</ion-content>
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

		async copySessionId() {
			try {
				await navigator.clipboard.writeText(this.game.session);
				this.toast("Game id coppied!");
			} 
			catch (e) {
				console.error(e);
			}
		},

		onTileClicked(x, y) {
		
		}
	}
}
</script>