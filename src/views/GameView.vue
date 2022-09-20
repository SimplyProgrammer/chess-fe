<template>
	<div v-if="game" class="h-full">
		<p class="text-center bg-slate-600 text-white border-0 border-black border-solid border-b-4 m-0 py-1" @dblclick="copySessionId">{{game.session}}</p>

		<div class="flex justify-center items-center h-[90%]">
			<Chess-Board v-bind="game" class="w-full aspect-[1] max-w-[78vh]"
				:getOnMoveData="doMove"
				:getMovmentMetrix="getMovmentMetrix"
				@onMate="endGame"
				@onTileClicked="onTileClicked" ref="chessBoard">
			</Chess-Board>
		</div>
		
		<footer class="absolute bottom-0 flex justify-between w-full border-2 border-black border-solid">
			<p class="bg-black text-white m-0 h-12 w-full">Black</p>
			<p class="bg-white text-black m-0 h-12 w-full">White</p>
		</footer>
	</div>
</template>

<script>
import ChessBoard from "@/components/ChessBoard.vue";
import Axios from "axios";
import {alertController} from "@ionic/vue";

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
		}
	},

	async mounted() {
		const comp = this;

		this.ws = new WebSocket(process.env.VUE_APP_API.replace(/https?/, "ws") + "game/" + this.$route.params.session);
		this.ws.onopen = async function(event) {
			console.log("Server connected." , event);
		};
		this.ws.onmessage = function(event) {
			const data = JSON.parse(event.data);
			if (data.type == "init")
			{
				comp.game = data.data;
			}
		};
		this.ws.onclose = function (event){
			console.log("Server disconnected." , event);
		};
	},

	unmounted() {
		this.ws.close();
	},

	methods: {
		piece(color, name = "p", sprite = null) {
			return {name, color};
		},

		async endGame(isCheck, canMove, isStalemate, onMove) {
			const alert = await alertController.create({
				header: "GOOD GAME!",
				subHeader: isStalemate ? "This looks like a draw!" : (onMove == 0 ? "Black" : "White") + " has won!",
				// message: 'This is an alert!',
				buttons: ['OK'],
				mode: "md"
			});

			await alert.present();
		},

		doMove(fromX, fromY, toX, toY) {
			return this.ws.response("move", {fromX, fromY, toX, toY});
		},

		getMovmentMetrix(x, y) {
			return this.ws.response("movmentMetrix", {x, y});
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