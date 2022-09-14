<template>
	<ion-content>
		<div class="flex justify-center items-center w-full h-full" v-if="game">
			<p class="text-center bg-slate-600 text-white border-0 border-black border-solid border-b-4 m-0 py-1" @dblclick="copySessionId">{{game.session}}</p>

			<div class="flex justify-center items-center h-[90%]">
				<ChessBoard v-if="game" class="w-full aspect-[1] max-w-[78vh]" v-bind="game" 
					:moveUrl="api + 'game/' + game.session + '/move'" 
					:movmentMetrixUrl="api + 'game/' + game.session + '/movmentMetrix'"
					@onTileClicked="onTileClicked" ref="chessBoard">
				</ChessBoard>
			</div>

			<footer class="absolute bottom-0 flex justify-between w-full border-2 border-black border-solid">
				<p class="bg-black text-white m-0 h-12 w-full">Black</p>
				<p class="bg-white text-black m-0 h-12 w-full">White</p>
			</footer>
		</div>
	</ion-content>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import Axios from "axios";

export default {
	components: {ChessBoard},

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
			api: process.env.VUE_APP_API
		}
	},

	async mounted() {
		this.game = (await Axios.get(process.env.VUE_APP_API + "game/" + this.$route.params.session)).data[0];
	},

	methods: {
		piece(color, name = "p", sprite = null) {
			return {name, color};
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