<template>
	<div class="flex justify-center items-center h-full">
		<ChessBoard v-if="gameChessBoard" class="lg:w-[50%] w-[90%]" :pieces="gameChessBoard" @onTileClicked="onTileClicked" ref="chessBoard"></ChessBoard>
		<button v-else @click="startNewGame">Start new game</button>
	</div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import Axios from "axios";

export default {
	components: {ChessBoard},

	data() {
		return {

			defaltPieces: [
				[this.piece(0, "r"), this.piece(0, "n"), this.piece(0, "b"), this.piece(0, "q"), this.piece(0, "k"), this.piece(0, "b"), this.piece(0, "n"), this.piece(0, "r")],
				[this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0)],
				[],
				[],
				[],
				[],
				[this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1)],
				[this.piece(1, "r"), this.piece(1, "n"), this.piece(1, "b"), this.piece(1, "q"), this.piece(1, "k"), this.piece(1, "b"), this.piece(1, "n"), this.piece(1, "r")]
			],

			currentGameSession: null,
			gameChessBoard: null
		}
	},

	methods: {
		async startNewGame() {
			let data = (await Axios.get(process.env.VUE_APP_API + "game/new")).data;
			this.currentGameSession = process.env.VUE_APP_API + "game/" + data;

			this.gameChessBoard = (await Axios.get(this.currentGameSession)).data[0].pieces;
			console.log(this.gameChessBoard = this.defaltPieces);
		},

		onTileClicked(x, y) {
		
		}
	}
}
</script>